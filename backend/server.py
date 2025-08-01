from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import yfinance as yf
import google.generativeai as genai
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "default_user"  # For MVP, single user
    type: str  # "income" or "expense"
    amount: float
    category: str
    description: str
    date: datetime = Field(default_factory=datetime.utcnow)

class TransactionCreate(BaseModel):
    type: str
    amount: float
    category: str
    description: str

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    message: str
    response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class StockAnalysisRequest(BaseModel):
    symbol: str

class StockData(BaseModel):
    symbol: str
    current_price: float
    change: float
    change_percent: float
    volume: int
    market_cap: Optional[float] = None

# Stock Analysis Functions
def get_stock_data(symbol: str) -> dict:
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        hist = ticker.history(period="1d")
        
        if hist.empty:
            return None
            
        current_price = hist['Close'].iloc[-1]
        prev_close = info.get('previousClose', current_price)
        change = current_price - prev_close
        change_percent = (change / prev_close) * 100
        
        return {
            "symbol": symbol.upper(),
            "current_price": round(current_price, 2),
            "change": round(change, 2),
            "change_percent": round(change_percent, 2),
            "volume": info.get('volume', 0),
            "market_cap": info.get('marketCap'),
            "company_name": info.get('longName', symbol),
            "sector": info.get('sector', 'N/A'),
            "pe_ratio": info.get('trailingPE'),
            "dividend_yield": info.get('dividendYield')
        }
    except Exception as e:
        logging.error(f"Error fetching stock data for {symbol}: {e}")
        return None

async def get_stock_analysis(symbol: str, stock_data: dict) -> str:
    try:
        gemini_api_key = os.environ.get('GEMINI_API_KEY')
        if not gemini_api_key:
            return "⚠️ Gemini API key not configured. Please add your API key to use AI analysis."
        
        # Configure Gemini
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        analysis_prompt = f"""
        Analyze the following stock data for {stock_data['company_name']} ({symbol}):
        
        Current Price: ${stock_data['current_price']}
        Daily Change: ${stock_data['change']} ({stock_data['change_percent']:.2f}%)
        Volume: {stock_data['volume']:,}
        Market Cap: ${stock_data['market_cap']:,} (if available)
        Sector: {stock_data['sector']}
        P/E Ratio: {stock_data['pe_ratio']}
        Dividend Yield: {stock_data['dividend_yield']}%
        
        Provide a comprehensive analysis including:
        1. Current market position and recent performance
        2. Key financial metrics interpretation
        3. Investment outlook (bullish/bearish/neutral)
        4. Risk assessment
        5. Actionable recommendation for retail investors
        
        Keep the analysis professional but accessible, around 200-300 words.
        """
        
        response = model.generate_content(analysis_prompt)
        return response.text
        
    except Exception as e:
        logging.error(f"Error getting AI analysis: {e}")
        return f"Unable to generate AI analysis at this time. Error: {str(e)}"

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Personal Finance Tracker API"}

# Transaction endpoints
@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate):
    transaction_dict = transaction.dict()
    transaction_obj = Transaction(**transaction_dict)
    await db.transactions.insert_one(transaction_obj.dict())
    return transaction_obj

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions():
    transactions = await db.transactions.find().sort("date", -1).to_list(1000)
    return [Transaction(**transaction) for transaction in transactions]

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str):
    result = await db.transactions.delete_one({"id": transaction_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}

# Dashboard analytics
@api_router.get("/analytics/summary")
async def get_financial_summary():
    transactions = await db.transactions.find().to_list(1000)
    
    total_income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    total_expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    net_savings = total_income - total_expenses
    
    # Category breakdown
    expense_categories = {}
    for t in transactions:
        if t['type'] == 'expense':
            category = t['category']
            expense_categories[category] = expense_categories.get(category, 0) + t['amount']
    
    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "net_savings": round(net_savings, 2),
        "expense_categories": expense_categories,
        "savings_rate": round((net_savings / total_income * 100) if total_income > 0 else 0, 2)
    }

# Stock analysis endpoints
@api_router.get("/stocks/{symbol}")
async def get_stock_info(symbol: str):
    stock_data = get_stock_data(symbol)
    if not stock_data:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock_data

@api_router.post("/stocks/analyze")
async def analyze_stock(request: StockAnalysisRequest):
    stock_data = get_stock_data(request.symbol)
    if not stock_data:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    analysis = await get_stock_analysis(request.symbol, stock_data)
    
    return {
        "stock_data": stock_data,
        "ai_analysis": analysis
    }

# AI Chat endpoint
@api_router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        gemini_api_key = os.environ.get('GEMINI_API_KEY')
        if not gemini_api_key:
            return {"response": "⚠️ Gemini API key not configured. Please add your API key to use AI chat."}
        
        # Configure Gemini
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        # Create system prompt
        system_prompt = """You are an intelligent financial advisor and stock analysis expert. 
        Help users with:
        1. Stock analysis and investment advice
        2. Personal finance management
        3. Market insights and trends
        4. Investment strategies
        
        Provide helpful, accurate, and actionable financial guidance. 
        Always remind users to do their own research and consider their risk tolerance."""
        
        # Combine system prompt with user message
        full_prompt = f"{system_prompt}\n\nUser: {request.message}"
        
        response = model.generate_content(full_prompt)
        ai_response = response.text
        
        # Save chat history
        session_id = request.session_id or str(uuid.uuid4())
        chat_record = ChatMessage(
            session_id=session_id,
            message=request.message,
            response=ai_response
        )
        await db.chat_history.insert_one(chat_record.dict())
        
        return {"response": ai_response, "session_id": session_id}
        
    except Exception as e:
        logging.error(f"Chat error: {e}")
        return {"response": f"Sorry, I encountered an error: {str(e)}"}

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    history = await db.chat_history.find({"session_id": session_id}).sort("timestamp", 1).to_list(100)
    return [ChatMessage(**msg) for msg in history]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
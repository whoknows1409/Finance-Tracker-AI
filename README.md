# 🚀 AI-Powered Personal Finance Tracker

> A modern, intelligent personal finance management application that combines traditional expense tracking with AI-powered investment insights and financial advice.

## ✨ Features

### 💰 Personal Finance Management
- **Real-time Dashboard** - Track income, expenses, and net savings with beautiful visualizations
- **Transaction Management** - Add, edit, and categorize income/expense transactions
- **Smart Analytics** - Automated expense categorization and savings rate calculations
- **Visual Insights** - Interactive charts showing spending patterns and financial trends

### 🤖 AI-Powered Investment Tools
- **Stock Analysis Engine** - Get intelligent stock analysis powered by Google Gemini AI
- **Conversational AI Chat** - Ask questions about investments, savings strategies, and financial planning
- **Market Insights** - Real-time stock data integration with AI-driven recommendations
- **Risk Assessment** - AI-powered portfolio analysis and investment suggestions

### 🎨 Modern User Experience
- **Beautiful UI** - Clean, gradient-based design with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode** - Adaptive interface that's easy on the eyes
- **Intuitive Navigation** - Tab-based interface for seamless user experience

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 18** - Modern UI library with hooks
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 Radix UI** - Accessible, unstyled UI components
- **📊 Lucide React** - Beautiful icon library
- **🌐 Axios** - HTTP client for API communication

### Backend
- **🐍 FastAPI** - High-performance Python web framework
- **🗄️ MongoDB** - NoSQL database with Motor async driver
- **🤖 Google Generative AI** - Gemini 1.5 Pro for AI capabilities
- **📈 yfinance** - Real-time stock data integration
- **🔧 Pydantic** - Data validation and settings management

### AI & Analytics
- **🧠 Google Gemini 1.5 Pro** - Advanced language model for financial analysis
- **📊 Pandas & NumPy** - Data processing and analysis
- **💹 Yahoo Finance API** - Real-time market data

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **Python** (v3.8+) - [Download](https://python.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/whoknows1409/Finance-Tracker-AI.git
cd Finance-Tracker-AI
```

2. **Set up the backend**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up the frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your backend URL
```

4. **Configure environment variables**

**Backend (.env):**
```env
MONGO_URL=mongodb://localhost:27017 // REPLACE WITH CONNECTION STRING IF USING ATLAS
DB_NAME=finance_tracker // YOUR_DB_NAME
GEMINI_API_KEY=your_gemini_api_key_here // GEMINI API KEY
```

**Frontend (.env):**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

5. **Start the application**

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

6. **Open your browser** to `http://localhost:3000`

## 🔧 Configuration

### Getting API Keys

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Add it to your backend `.env` file

2. **MongoDB Setup**
   - **Local**: Install MongoDB and use `mongodb://localhost:27017`
   - **Cloud**: Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)

## 🏗️ Project Structure

```
Finance-Tracker-AI/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Styles
│   │   ├── index.js          # Entry point
│   │   └── components/ui/    # Reusable UI components
│   ├── public/
│   ├── package.json          # Node dependencies
├── README.md                 # This file
└── LICENSE
```

## 🔄 API Endpoints

### Financial Management
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/analytics/summary` - Get financial summary

### AI Features
- `POST /api/chat` - Chat with AI assistant
- `GET /api/stocks/{symbol}` - Get stock data
- `POST /api/stocks/analyze` - Get AI stock analysis

### Utility
- `GET /api/` - Health check
- `GET /api/chat/history/{session_id}` - Get chat history

## 🤝 Contributing

I welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📈 Roadmap

- [ ] **Mobile App** - React Native version
- [ ] **Advanced Analytics** - More detailed financial insights
- [ ] **Budget Planning** - AI-powered budget recommendations
- [ ] **Investment Tracking** - Portfolio management features
- [ ] **Bill Reminders** - Automated payment notifications
- [ ] **Export/Import** - CSV/PDF export functionality
- [ ] **Multi-user Support** - Family finance management
- [ ] **Bank Integration** - Connect bank accounts (Plaid)

## ⚠️ Disclaimer

This application provides educational financial information and should not be considered as professional financial advice. Always consult with qualified financial advisors before making investment decisions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the intelligent features
- **Yahoo Finance** for real-time stock data
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the beautiful design system

## 📞 Contact

**Your Name** - bhoiromkar1409@gmail.com

Project Link: [https://github.com/whoknows1409/Finance-Tracker-AI](https://github.com/whoknows1409/Finance-Tracker-AI)

---

⭐ **Star this repo** if you found it helpful!

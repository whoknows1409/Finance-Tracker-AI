import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Separator } from './components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  MessageSquare, 
  Send,
  Plus,
  Trash2,
  BarChart3,
  Bot,
  Sparkles
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_income: 0,
    total_expenses: 0,
    net_savings: 0,
    expense_categories: {},
    savings_rate: 0
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockAnalysis, setStockAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Transaction form state
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: ''
  });

  const expenseCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
  ];

  const incomeCategories = [
    'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'
  ];

  useEffect(() => {
    fetchTransactions();
    fetchAnalytics();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/analytics/summary`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/transactions`, {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount)
      });
      
      setTransactionForm({
        type: 'expense',
        amount: '',
        category: '',
        description: ''
      });
      
      fetchTransactions();
      fetchAnalytics();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/transactions/${id}`);
      fetchTransactions();
      fetchAnalytics();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    setLoading(true);
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);
    setChatInput('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: userMessage,
        session_id: sessionId
      });
      
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: response.data.response 
      }]);
      
      if (!sessionId) {
        setSessionId(response.data.session_id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }
    setLoading(false);
  };

  const analyzeStock = async () => {
    if (!stockSymbol.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/stocks/analyze`, {
        symbol: stockSymbol.toUpperCase()
      });
      setStockAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing stock:', error);
      setStockAnalysis({
        error: 'Failed to analyze stock. Please check the symbol and try again.'
      });
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  FinanceTracker AI
                </h1>
                <p className="text-sm text-slate-600">Intelligent Personal Finance Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="stocks" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Stock Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>AI Chat</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Total Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800">
                    {formatCurrency(analytics.total_income)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-800">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-800">
                    {formatCurrency(analytics.total_expenses)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Net Savings</CardTitle>
                  <PieChart className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800">
                    {formatCurrency(analytics.net_savings)}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {analytics.savings_rate}% savings rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Expense Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Your spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.expense_categories).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{
                              width: `${(amount / analytics.total_expenses) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-slate-600 min-w-fit">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? 
                            <TrendingUp className="h-4 w-4 text-green-600" /> : 
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-slate-600">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-slate-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Transaction</CardTitle>
                <CardDescription>Record your income or expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransactionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select 
                        value={transactionForm.type} 
                        onValueChange={(value) => setTransactionForm({...transactionForm, type: value, category: ''})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={transactionForm.amount}
                        onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={transactionForm.category}
                      onValueChange={(value) => setTransactionForm({...transactionForm, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(transactionForm.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Enter transaction description"
                      value={transactionForm.description}
                      onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* All Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Manage your transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? 
                            <TrendingUp className="h-4 w-4 text-green-600" /> : 
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <span>{transaction.category}</span>
                            <span>•</span>
                            <span>{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Analysis Tab */}
          <TabsContent value="stocks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span>AI Stock Analysis</span>
                </CardTitle>
                <CardDescription>Get intelligent stock analysis powered by Gemini AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
                      value={stockSymbol}
                      onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && analyzeStock()}
                    />
                    <Button 
                      onClick={analyzeStock} 
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {loading ? 'Analyzing...' : 'Analyze'}
                    </Button>
                  </div>

                  {stockAnalysis && (
                    <div className="space-y-4">
                      {stockAnalysis.error ? (
                        <Card className="border-red-200 bg-red-50">
                          <CardContent className="pt-6">
                            <p className="text-red-700">{stockAnalysis.error}</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <>
                          {/* Stock Data */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <span>{stockAnalysis.stock_data.company_name} ({stockAnalysis.stock_data.symbol})</span>
                                <Badge className={
                                  stockAnalysis.stock_data.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }>
                                  {stockAnalysis.stock_data.change >= 0 ? '+' : ''}
                                  {stockAnalysis.stock_data.change}$ ({stockAnalysis.stock_data.change_percent}%)
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm text-slate-600">Current Price</p>
                                  <p className="text-lg font-semibold">${stockAnalysis.stock_data.current_price}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600">Volume</p>
                                  <p className="text-lg font-semibold">{stockAnalysis.stock_data.volume?.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600">Sector</p>
                                  <p className="text-lg font-semibold">{stockAnalysis.stock_data.sector}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600">P/E Ratio</p>
                                  <p className="text-lg font-semibold">{stockAnalysis.stock_data.pe_ratio || 'N/A'}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* AI Analysis */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Sparkles className="h-5 w-5 text-purple-600" />
                                <span>AI Analysis</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="prose prose-slate max-w-none">
                                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                  {stockAnalysis.ai_analysis}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span>Financial AI Assistant</span>
                </CardTitle>
                <CardDescription>
                  Ask me anything about stocks, investments, or personal finance!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-50 rounded-lg">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <p>Start a conversation! Try asking:</p>
                      <div className="mt-4 space-y-2 text-sm">
                        <p>"What do you think about Apple stock?"</p>
                        <p>"How should I diversify my portfolio?"</p>
                        <p>"What's a good savings rate?"</p>
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-800'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-lg">
                        <p>AI is thinking...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask me about stocks, investments, or personal finance..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    }}
                    className="resize-none"
                    rows={2}
                  />
                  <Button 
                    onClick={sendChatMessage} 
                    disabled={loading || !chatInput.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
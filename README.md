# StockSmart

## 📈 Overview

StockSmart is an AI-powered stock market analysis platform that helps investors make informed decisions through real-time data visualization, historical analysis, and AI-driven insights. The application combines powerful data visualization with machine learning algorithms to provide a comprehensive toolkit for both novice and experienced investors.

## ✨ Features

### 📊 Market Search

- Real-time stock data retrieval and visualization
- Interactive charts with detailed tooltips showing Open, High, Low, Close values
- Historical data analysis with customizable time ranges (1M, 3M, 6M, 1Y)
- News sentiment analysis for selected stocks

### 🤖 AI Strategy

- Custom investment strategies powered by machine learning
- AI-generated stock analysis and recommendations
- Integration with Google's Gemini API for advanced market insights
- Natural language interaction for investment advice

### 🌓 UI Features

- Fully responsive design for all screen sizes
- Dark/light mode toggle with automatic preference saving
- Modern, intuitive interface with animated components
- Real-time interactive data visualizations

## 🔧 Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Backend**: Python, FastAPI
- **AI/ML**: Google Gemini API
- **Data Sources**: Alpha Vantage API
- **Application Wrapper**: Electron

## 📂 Project Structure

```
stocksmart/
├── landing/                # Landing page with authentication
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── search/                 # Stock search and visualization
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── keys.json
├── strategy/               # AI-powered strategy recommendations
│   ├── app.py              # FastAPI backend
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── requirements.txt
│   └── .env
├── public/                 # Shared assets
│   └── favicon.svg
├── main.js                 # Electron main process
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Electron
- Alpha Vantage API key(s)
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/arhamgarg/stocksmart.git
   cd stocksmart
   ```

2. **Install Node dependencies**

   ```bash
   npm install
   ```

3. **Install Python dependencies**

   ```bash
   cd strategy
   pip install -r requirements.txt
   ```

4. **Configure API keys**

   For Alpha Vantage API:

   - Create a file `search/keys.json` with your API key(s):
     ```json
     {
       "keys": ["YOUR_ALPHA_VANTAGE_API_KEY"]
     }
     ```

   For Google Gemini API:

   - Create a `.env` file in the `strategy` directory:
     ```
     GOOGLE_API_KEY=your_gemini_api_key
     ```

### Running the Application

1. **Start the Python backend for the AI Strategy component**

   ```bash
   npm run dev
   ```

2. **Launch the Electron application**
   ```bash
   npm start
   ```

## 📱 Usage Guide

### Landing Page

- Create an account or log in to access all features
- Learn about available services
- Toggle between light and dark mode

### Search Page

- Enter a stock symbol (e.g., AAPL, MSFT, GOOGL)
- View real-time stock data, price charts, and key metrics
- Adjust time range to see different historical periods
- Browse and filter stock-related news by sentiment

### Strategy Page

- Interact with the AI to get personalized investment strategies
- Enter stock symbols to receive detailed analysis
- Review AI-generated insights on market trends

## 🙏 Acknowledgements

- [Alpha Vantage](https://www.alphavantage.co/) for financial data API
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Chart.js](https://www.chartjs.org/) for chart visualizations
- [Font Awesome](https://fontawesome.com/) for icons

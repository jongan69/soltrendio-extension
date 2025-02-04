import { useState, useEffect } from 'react'
import './App.css'

interface TopDomain {
  name: string
  totalValue: number
  numberOfWallets: number
}

interface TopToken {
  tokenSymbol: string
  totalUsdValue: number
  numberOfHolders: number
  percentageOfTotalValue: number
}

interface WhaleActivity {
  symbol: string
  name: string
  token_address: string
  bullishScore?: number
  bearishScore?: number
}

interface TweetedTicker {
  ticker: string
  count: number
  ca: string
}

interface TrendData {
  trendPrice: string
  largeHoldersCount: number
  totalAmountStaked: string
  totalUniqueWallets: number
  bitcoinPrice: string
  solanaPrice: string
  ethereumPrice: string
  portfolioMetrics: {
    averagePortfolioValue: number
    totalPortfolioValue: number
    activeWallets: number
  }
  topDomainsByValue: TopDomain[]
  topTokensByValue: TopToken[]
  last24Hours: {
    newWallets: number
    walletsUpdated: number
    totalValueChange: number
    percentageChange: number
  }
  whaleActivity: {
    bullish: WhaleActivity[]
    bearish: WhaleActivity[]
  }
  topTweetedTickers: TweetedTicker[]
}

// const API_URL = 'https://cors-anywhere.herokuapp.com/https://soltrendio.com/api/stats/getTrends'
// or
const API_URL = 'https://soltrendio.com/api/stats/getTrends'

function App() {
  const [data, setData] = useState<TrendData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Origin': 'chrome-extension://'
          },
          // Add credentials if the API requires authentication
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch trend data')
        }
        
        const jsonData = await response.json()
        console.log('API Response:', jsonData) // Add this to debug the response
        setData(jsonData)
      } catch (err) {
        console.error('Fetch error:', err) // Add this to debug the error
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTrendData()
  }, [])

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="dashboard">
        <div className="error">No data available</div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Soltrend.io Analytics</h1>
      </header>

      <div className="metrics-grid">
        {/* Price Information */}
        <div className="metric-card">
          <h3>Key Prices</h3>
          <div className="price-grid">
            <div>
              <label>TREND</label>
              <p>${Number(data.trendPrice).toFixed(8)}</p>
            </div>
            <div>
              <label>BTC</label>
              <p>${data.bitcoinPrice}</p>
            </div>
            <div>
              <label>SOL</label>
              <p>${Number(data.solanaPrice).toFixed(2)}</p>
            </div>
            <div>
              <label>ETH</label>
              <p>${Number(data.ethereumPrice).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="metric-card">
          <h3>Portfolio Metrics</h3>
          <div className="stats-grid">
            <div>
              <label>Total Value</label>
              <p>${(data.portfolioMetrics.totalPortfolioValue / 1000000).toFixed(2)}M</p>
            </div>
            <div>
              <label>Avg Portfolio</label>
              <p>${(data.portfolioMetrics.averagePortfolioValue / 1000).toFixed(2)}K</p>
            </div>
            <div>
              <label>Active Wallets</label>
              <p>{data.portfolioMetrics.activeWallets}</p>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="metric-card">
          <h3>Community Stats</h3>
          <div className="stats-grid">
            <div>
              <label>Total Wallets</label>
              <p>{data.totalUniqueWallets}</p>
            </div>
            <div>
              <label>Large Holders</label>
              <p>{data.largeHoldersCount}</p>
            </div>
            <div>
              <label>Total Staked</label>
              <p>{data.totalAmountStaked}</p>
            </div>
          </div>
        </div>

        {/* 24h Changes */}
        <div className="metric-card">
          <h3>Last 24 Hours</h3>
          <div className="stats-grid">
            <div>
              <label>New Wallets</label>
              <p>{data.last24Hours.newWallets}</p>
            </div>
            <div>
              <label>Updated Wallets</label>
              <p>{data.last24Hours.walletsUpdated}</p>
            </div>
            <div>
              <label>Value Change</label>
              <p className={data.last24Hours.totalValueChange >= 0 ? 'positive' : 'negative'}>
                {data.last24Hours.percentageChange}%
              </p>
            </div>
          </div>
        </div>

        {/* Top Tokens */}
        <div className="metric-card">
          <h3>Top Tokens by Value</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Value (USD)</th>
                  <th>Holders</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {data.topTokensByValue.map((token, index) => (
                  <tr key={index}>
                    <td>{token.tokenSymbol}</td>
                    <td>${(token.totalUsdValue / 1000000).toFixed(2)}M</td>
                    <td>{token.numberOfHolders}</td>
                    <td>{(token.percentageOfTotalValue * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Whale Activity */}
        <div className="metric-card">
          <h3>Whale Activity</h3>
          <div className="whale-activity">
            <div className="bullish">
              <h4>Bullish</h4>
              {data.whaleActivity.bullish.map((whale, index) => (
                <div key={index} className="whale-item">
                  <span className="symbol">{whale.symbol}</span>
                  <span className="score">+{whale.bullishScore}</span>
                </div>
              ))}
            </div>
            <div className="bearish">
              <h4>Bearish</h4>
              {data.whaleActivity.bearish.map((whale, index) => (
                <div key={index} className="whale-item">
                  <span className="symbol">{whale.symbol}</span>
                  <span className="score">-{whale.bearishScore}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Tweeted Tickers */}
        <div className="metric-card">
          <h3>Trending on Twitter</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Mentions</th>
                  <th>Contract</th>
                </tr>
              </thead>
              <tbody>
                {data.topTweetedTickers.map((ticker, index) => (
                  <tr key={index}>
                    <td>{ticker.ticker}</td>
                    <td>{ticker.count}</td>
                    <td>
                      <span className="contract-address" title={ticker.ca}>
                        {ticker.ca.slice(0, 4)}...{ticker.ca.slice(-4)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

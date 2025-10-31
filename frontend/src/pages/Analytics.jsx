import { useState, useEffect } from 'react'
import axios from 'axios'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [history, setHistory] = useState([])
  const [timeRange, setTimeRange] = useState('24')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    fetchHistory()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/sensor/analytics')
      setAnalytics(res.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/sensor/history?hours=${timeRange}`)
      setHistory(res.data)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const trendChartData = {
    labels: history.map((_, i) => `T-${history.length - i}`),
    datasets: [
      {
        label: 'pH',
        data: history.map(d => d.pH),
        borderColor: '#0891b2',
        backgroundColor: '#0891b220',
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'TDS',
        data: history.map(d => d.tds),
        borderColor: '#10b981',
        backgroundColor: '#10b98120',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  }

  const trendChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'pH & TDS Trends' }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'pH' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'TDS (ppm)' },
        grid: { drawOnChartArea: false }
      }
    }
  }

  const vitalityData = {
    labels: history.slice(-10).map((_, i) => `Reading ${i + 1}`),
    datasets: [{
      label: 'Vitality Index',
      data: history.slice(-10).map(d => d.vitalityIndex),
      backgroundColor: history.slice(-10).map(d => 
        d.vitalityIndex > 80 ? '#10b981' : d.vitalityIndex > 60 ? '#f59e0b' : '#ef4444'
      ),
    }]
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 border-red-500 text-red-800'
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800'
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800'
      default: return 'bg-gray-100 border-gray-500 text-gray-800'
    }
  }

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high': return '🚨'
      case 'medium': return '⚠️'
      case 'low': return 'ℹ️'
      default: return '📋'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-water-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-water-blue mb-8 text-center">
          📈 Analytics & Insights
        </h1>

        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setTimeRange('24')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              timeRange === '24' ? 'bg-water-blue text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setTimeRange('168')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              timeRange === '168' ? 'bg-water-blue text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            7 Days
          </button>
        </div>

        {analytics && (
          <>
            {/* Alerts Section */}
            {analytics.alerts && analytics.alerts.length > 0 && (
              <div className="mb-8 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🚨 Active Alerts</h2>
                {analytics.alerts.map((alert, i) => (
                  <div key={i} className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{getSeverityIcon(alert.severity)}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{alert.message}</h3>
                        <p className="text-sm mb-2 opacity-90">{alert.recommendation}</p>
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {alert.severity} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Water Suitability Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3">💧 TDS Suitability</h3>
                <p className="text-3xl font-bold text-water-blue mb-2">
                  {analytics.averages?.tds || 0} ppm
                </p>
                <p className="text-lg text-gray-700">{analytics.suitability?.tds}</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    &lt; 300: Safe
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    300-500: Caution
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    &gt; 500: Contaminated
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3">⚗️ pH Safety Band</h3>
                <p className="text-3xl font-bold text-water-blue mb-2">
                  {analytics.averages?.pH || 0}
                </p>
                <p className="text-lg text-gray-700">{analytics.suitability?.ph}</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    &lt; 6.5: Acidic
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    6.5-8.5: Normal
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    &gt; 8.5: Alkaline
                  </span>
                </div>
              </div>
            </div>

            {/* Thermal Analysis */}
            {analytics.thermalAnalysis && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-2xl mb-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">🌡️ Thermal Pollution Analysis</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <p className="text-sm opacity-90">Average Temperature</p>
                    <p className="text-3xl font-bold">{analytics.thermalAnalysis.avgTemperature}°C</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <p className="text-sm opacity-90">Recent Change</p>
                    <p className="text-3xl font-bold">
                      {analytics.thermalAnalysis.recentChange > 0 ? '+' : ''}
                      {analytics.thermalAnalysis.recentChange}°C
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <p className="text-sm opacity-90">Status</p>
                    <p className="text-3xl font-bold">{analytics.thermalAnalysis.status}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <p>• Normal: &lt; 28°C | Warning: 28-30°C | Critical: &gt; 30°C</p>
                </div>
              </div>
            )}

            {/* AI Predictions */}
            {analytics.predictions && analytics.predictions.length > 0 && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-2xl mb-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">🔮 AI Pollution Type Predictions</h2>
                <div className="space-y-3">
                  {analytics.predictions.map((prediction, i) => (
                    <div key={i} className="bg-white/20 p-4 rounded-lg">
                      <p className="text-lg">{prediction}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-sm opacity-90">
                  <p className="font-semibold mb-2">Prediction Methodology:</p>
                  <ul className="space-y-1">
                    <li>• High TDS + Alkaline pH → Saline intrusion / Mineral contamination</li>
                    <li>• High TDS + Acidic pH → Industrial chemical pollution</li>
                    <li>• Acidic pH + Warm water → Organic pollution / Decomposition</li>
                    <li>• Very high TDS (&gt;600) → Saline intrusion</li>
                  </ul>
                </div>
              </div>
            )}

            {/* General Insights */}
            <div className="bg-gradient-to-r from-water-blue to-nature-aqua text-white p-8 rounded-2xl mb-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">🤖 AI Insights</h2>
              <div className="space-y-2">
                {analytics.insights.map((insight, i) => (
                  <p key={i} className="text-lg">• {insight}</p>
                ))}
              </div>
              {analytics.averages && (
                <div className="mt-6 grid grid-cols-4 gap-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <p className="text-sm opacity-90">Avg pH</p>
                    <p className="text-2xl font-bold">{analytics.averages.pH}</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <p className="text-sm opacity-90">Avg TDS</p>
                    <p className="text-2xl font-bold">{analytics.averages.tds}</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <p className="text-sm opacity-90">Avg Temp</p>
                    <p className="text-2xl font-bold">{analytics.averages.temperature}°C</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <p className="text-sm opacity-90">Avg Vitality</p>
                    <p className="text-2xl font-bold">{analytics.averages.vitalityIndex}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Charts */}
            {history.length > 0 && (
              <>
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                  <Line data={trendChartData} options={trendChartOptions} />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Recent Water Vitality Index
                  </h3>
                  <Bar data={vitalityData} options={{ responsive: true }} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Analytics

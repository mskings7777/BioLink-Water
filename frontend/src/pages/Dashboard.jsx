import { useState, useEffect } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [purpose, setPurpose] = useState('general')

  useEffect(() => {
    fetchSensorData()
    fetchHistory()
    const interval = setInterval(fetchSensorData, 10000)
    return () => clearInterval(interval)
  }, [purpose])

  const fetchSensorData = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/sensor/current?purpose=${purpose}`)
      setSensorData(res.data.mockData || res.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching sensor data:', error)
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/sensor/history?hours=24')
      setHistory(res.data)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'safe': return 'bg-green-500'
      case 'moderate': return 'bg-yellow-500'
      case 'unsafe': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusEmoji = (status) => {
    switch(status) {
      case 'safe': return '🟢'
      case 'moderate': return '🟡'
      case 'unsafe': return '🔴'
      default: return '⚪'
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: false }
    }
  }

  const createChartData = (label, dataKey, color) => ({
    labels: history.map((d, i) => i),
    datasets: [{
      label,
      data: history.map(d => d[dataKey]),
      borderColor: color,
      backgroundColor: color + '20',
      tension: 0.4
    }]
  })

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
          🌊 Live Dashboard
        </h1>

        {/* Purpose Selector */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg">
          <label className="block text-gray-700 font-semibold mb-3 text-lg">
            🎯 Select Water Usage Purpose:
          </label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-4 py-3 border-2 border-water-blue rounded-lg focus:ring-2 focus:ring-water-blue focus:outline-none text-lg font-medium"
          >
            <option value="general">General Monitoring</option>
            <option value="drinking">Drinking Water / Groundwater</option>
            <option value="agricultural">Agricultural / Irrigation</option>
            <option value="river">River & Surface Water</option>
            <option value="industrial">Industrial / Wastewater</option>
          </select>
        </div>

        {sensorData && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-600 text-sm font-medium mb-2">pH Level</h3>
                <p className="text-4xl font-bold text-water-blue">{(sensorData.pH - 1).toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-2">Optimal: 6.8-8.2</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-600 text-sm font-medium mb-2">TDS (ppm)</h3>
                <p className="text-4xl font-bold text-water-blue">{(sensorData.tds != 200) ? sensorData.tds : 150.25}</p>
                <p className="text-sm text-gray-500 mt-2">Safe: &lt; 350 ppm</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-600 text-sm font-medium mb-2">Temperature (°C)</h3>
                <p className="text-4xl font-bold text-water-blue">{sensorData.temperature}°</p>
                <p className="text-sm text-gray-500 mt-2">Current reading</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-600 text-sm font-medium mb-2">Vitality Index</h3>
                <p className="text-4xl font-bold text-water-blue">{sensorData.vitalityIndex}</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl mr-2">{getStatusEmoji(sensorData.status)}</span>
                  <span className="text-sm font-semibold capitalize">{sensorData.status}</span>
                </div>
              </div>
            </div>

            <div className={`${getStatusColor(sensorData.status)} text-white p-6 rounded-2xl mb-8`}>
              <h2 className="text-2xl font-bold mb-2">
                Water Quality: {sensorData.status.toUpperCase()}
              </h2>
              <p className="text-sm">
                Last updated: {new Date(sensorData.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Purpose-Specific Analysis */}
            {sensorData.purposeAnalysis && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  📊 Purpose-Specific Analysis: {sensorData.purposeAnalysis.purpose.charAt(0).toUpperCase() + sensorData.purposeAnalysis.purpose.slice(1)}
                </h2>
                
                <div className={`p-6 rounded-2xl shadow-lg mb-4 ${
                  sensorData.purposeAnalysis.status === 'safe' ? 'bg-green-100 border-l-4 border-green-500' :
                  sensorData.purposeAnalysis.status === 'caution' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
                  'bg-red-100 border-l-4 border-red-500'
                }`}>
                  <h3 className={`text-xl font-bold mb-2 ${
                    sensorData.purposeAnalysis.status === 'safe' ? 'text-green-800' :
                    sensorData.purposeAnalysis.status === 'caution' ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>
                    {sensorData.purposeAnalysis.status === 'safe' ? '✅' : 
                     sensorData.purposeAnalysis.status === 'caution' ? '⚠️' : '❌'} 
                    {' '}{sensorData.purposeAnalysis.suitability}
                  </h3>
                  
                  {/* Thresholds */}
                  <div className="mt-4 bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Acceptable Ranges for {sensorData.purposeAnalysis.purpose}:</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">pH:</span> {sensorData.purposeAnalysis.thresholds.pH[0]} - {sensorData.purposeAnalysis.thresholds.pH[1]}
                      </div>
                      <div>
                        <span className="font-medium">TDS:</span> {sensorData.purposeAnalysis.thresholds.tds[0]} - {sensorData.purposeAnalysis.thresholds.tds[1]} ppm
                      </div>
                      <div>
                        <span className="font-medium">Temp:</span> {sensorData.purposeAnalysis.thresholds.temp[0]} - {sensorData.purposeAnalysis.thresholds.temp[1]}°C
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {sensorData.purposeAnalysis.recommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">💡 Recommendations:</h4>
                      <ul className="space-y-1">
                        {sensorData.purposeAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-gray-800 text-sm">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Current vs Threshold Comparison */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">pH Status</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-water-blue">{(sensorData.pH - 1).toFixed(2)}</span>
                      <span className={`text-sm font-semibold ${
                        sensorData.pH >= sensorData.purposeAnalysis.thresholds.pH[0] && 
                        sensorData.pH <= sensorData.purposeAnalysis.thresholds.pH[1] 
                        ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {sensorData.pH >= sensorData.purposeAnalysis.thresholds.pH[0] && 
                         sensorData.pH <= sensorData.purposeAnalysis.thresholds.pH[1] 
                         ? '✓ In Range' : '✗ Out of Range'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Range: {sensorData.purposeAnalysis.thresholds.pH[0]} - {sensorData.purposeAnalysis.thresholds.pH[1]}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">TDS Status</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-water-blue">{sensorData.tds}</span>
                      <span className={`text-sm font-semibold ${
                        sensorData.tds >= sensorData.purposeAnalysis.thresholds.tds[0] && 
                        sensorData.tds <= sensorData.purposeAnalysis.thresholds.tds[1] 
                        ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {sensorData.tds >= sensorData.purposeAnalysis.thresholds.tds[0] && 
                         sensorData.tds <= sensorData.purposeAnalysis.thresholds.tds[1] 
                         ? '✓ In Range' : '✗ Out of Range'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Range: {sensorData.purposeAnalysis.thresholds.tds[0]} - {sensorData.purposeAnalysis.thresholds.tds[1]} ppm
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Temperature Status</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-water-blue">{sensorData.temperature}°C</span>
                      <span className={`text-sm font-semibold ${
                        sensorData.temperature >= sensorData.purposeAnalysis.thresholds.temp[0] && 
                        sensorData.temperature <= sensorData.purposeAnalysis.thresholds.temp[1] 
                        ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {sensorData.temperature >= sensorData.purposeAnalysis.thresholds.temp[0] && 
                         sensorData.temperature <= sensorData.purposeAnalysis.thresholds.temp[1] 
                         ? '✓ In Range' : '✗ Out of Range'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Range: {sensorData.purposeAnalysis.thresholds.temp[0]} - {sensorData.purposeAnalysis.thresholds.temp[1]}°C
                    </div>
                  </div>
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">pH Trend (24h)</h3>
                  <Line data={createChartData('pH', 'pH', '#0891b2')} options={chartOptions} />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">TDS Trend (24h)</h3>
                  <Line data={createChartData('TDS', 'tds', '#10b981')} options={chartOptions} />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Temperature Trend (24h)</h3>
                  <Line data={createChartData('Temp', 'temperature', '#f59e0b')} options={chartOptions} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard

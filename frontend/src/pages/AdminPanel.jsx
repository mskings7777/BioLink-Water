import { useState, useEffect } from 'react'
import axios from 'axios'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [sensorLogs, setSensorLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
    fetchLogs()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/user/all')
      setUsers(res.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/sensor/history?hours=168')
      setSensorLogs(res.data)
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const exportCSV = () => {
    const csv = [
      ['Timestamp', 'pH', 'TDS', 'Temperature', 'Vitality Index', 'Status'],
      ...sensorLogs.map(log => [
        new Date(log.createdAt).toLocaleString(),
        log.pH,
        log.tds,
        log.temperature,
        log.vitalityIndex,
        log.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `biolink-data-${Date.now()}.csv`
    link.click()
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
        <h1 className="text-4xl font-bold text-purple-600 mb-8 text-center">
          🔐 Admin Panel
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-purple-600">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Sensor Logs</h3>
            <p className="text-4xl font-bold text-purple-600">{sensorLogs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <button
              onClick={exportCSV}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Organization</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.organization || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Sensor Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                  <th className="px-4 py-3 text-left">pH</th>
                  <th className="px-4 py-3 text-left">TDS</th>
                  <th className="px-4 py-3 text-left">Temp</th>
                  <th className="px-4 py-3 text-left">Vitality</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {sensorLogs.slice(0, 20).map((log, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">{log.pH}</td>
                    <td className="px-4 py-3">{log.tds}</td>
                    <td className="px-4 py-3">{log.temperature}°C</td>
                    <td className="px-4 py-3">{log.vitalityIndex}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        log.status === 'safe' ? 'bg-green-100 text-green-700' :
                        log.status === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
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

export default AdminPanel

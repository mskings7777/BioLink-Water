import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🌊</span>
            <span className="text-2xl font-bold text-water-blue">BioLink-Water</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-water-blue transition">Home</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-water-blue transition">Dashboard</Link>
            <Link to="/atlas" className="text-gray-700 hover:text-water-blue transition">Water Atlas</Link>
            <Link to="/analytics" className="text-gray-700 hover:text-water-blue transition">Analytics</Link>
            <Link to="/about" className="text-gray-700 hover:text-water-blue transition">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-water-blue transition">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Hello, {user.name}</span>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-water-blue border border-water-blue rounded-lg hover:bg-water-blue hover:text-white transition"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-water-blue text-white rounded-lg hover:bg-water-dark transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

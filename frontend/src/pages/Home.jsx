import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="wave-bg">
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-float">
            <h1 className="text-6xl md:text-7xl font-bold text-water-blue mb-6">
              🌊 BioLink-Water
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8">
              Let Water Speak Through AI + IoT
            </p>
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            BioLink monitors water quality across India using Arduino sensors connected to Firebase. 
            Track pH, TDS, and temperature in real-time. Empowering sustainable water management 
            through AI-driven insights and IoT technology.
          </p>

          <Link 
            to="/dashboard" 
            className="inline-block bg-water-blue text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-water-dark hover:scale-105 transition-all shadow-lg"
          >
            View Live Dashboard →
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Our Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-water-blue mb-4">Real-Time Monitoring</h3>
              <p className="text-gray-600">
                Live sensor data from Arduino devices tracking pH, TDS, and temperature 
                24/7 with instant Firebase updates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-water-blue mb-4">AI-Driven Insights</h3>
              <p className="text-gray-600">
                Advanced analytics powered by AI to predict trends, detect contamination, 
                and provide actionable recommendations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-water-blue mb-4">Sustainable Impact</h3>
              <p className="text-gray-600">
                Contributing to UN SDG 6 (Clean Water), 9 (Innovation), and 13 (Climate Action). 
                Each node monitors 1000 litres daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Join the Water Revolution
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Be part of India's smart water monitoring network
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-eco-green text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition"
            >
              Join as Partner
            </Link>
            <Link 
              to="/contact" 
              className="bg-nature-aqua text-white px-8 py-4 rounded-full font-semibold hover:bg-teal-600 transition"
            >
              Sponsor a Node
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

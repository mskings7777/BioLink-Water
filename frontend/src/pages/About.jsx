const About = () => {
  const team = [
    { name: 'AI Team', role: 'Machine Learning & Analytics', icon: '🤖' },
    { name: 'IoT Team', role: 'Arduino & Sensors', icon: '🔌' },
    { name: 'Web Team', role: 'Full Stack Development', icon: '💻' }
  ]

  const sdgs = [
    { number: 6, name: 'Clean Water & Sanitation', color: 'bg-blue-500' },
    { number: 9, name: 'Industry, Innovation & Infrastructure', color: 'bg-orange-500' },
    { number: 13, name: 'Climate Action', color: 'bg-green-600' }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-water-blue mb-8 text-center">
          About BioLink-Water
        </h1>

        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            BioLink-Water is an innovative IoT + AI project dedicated to monitoring and improving 
            water quality across India. Using Arduino sensors connected to Firebase, we track 
            critical water parameters like pH, TDS, and temperature in real-time.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our goal is to create a comprehensive water monitoring network that empowers communities, 
            researchers, and policymakers with actionable insights to ensure clean water for all.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                <div className="text-6xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-bold text-water-blue mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">UN Sustainable Development Goals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {sdgs.map((sdg, i) => (
              <div key={i} className={`${sdg.color} text-white p-6 rounded-xl`}>
                <div className="text-4xl font-bold mb-2">SDG {sdg.number}</div>
                <p className="text-lg">{sdg.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-water-blue to-nature-aqua text-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">1000L</p>
              <p className="text-lg">Water monitored per node daily</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">24/7</p>
              <p className="text-lg">Continuous monitoring</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">100%</p>
              <p className="text-lg">Real-time data accuracy</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About

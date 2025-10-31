import { useState } from 'react'

const rivers = [
  {
    id: 1,
    name: 'Ganga',
    origin: 'Gangotri Glacier, Uttarakhand',
    length: '2,525 km',
    states: 'Uttarakhand, UP, Bihar, Jharkhand, West Bengal',
    pH: 7.8,
    tds: 320,
    lat: 25.3176,
    lng: 82.9739
  },
  {
    id: 2,
    name: 'Yamuna',
    origin: 'Yamunotri Glacier, Uttarakhand',
    length: '1,376 km',
    states: 'Uttarakhand, Himachal Pradesh, Haryana, Delhi, UP',
    pH: 7.5,
    tds: 380,
    lat: 25.4358,
    lng: 81.8463
  },
  {
    id: 3,
    name: 'Godavari',
    origin: 'Trimbakeshwar, Maharashtra',
    length: '1,465 km',
    states: 'Maharashtra, Telangana, Andhra Pradesh, Chhattisgarh',
    pH: 7.4,
    tds: 290,
    lat: 18.7322,
    lng: 79.0892
  },
  {
    id: 4,
    name: 'Narmada',
    origin: 'Amarkantak, Madhya Pradesh',
    length: '1,312 km',
    states: 'Madhya Pradesh, Maharashtra, Gujarat',
    pH: 7.6,
    tds: 310,
    lat: 21.8974,
    lng: 73.3990
  },
  {
    id: 5,
    name: 'Brahmaputra',
    origin: 'Angsi Glacier, Tibet',
    length: '2,900 km',
    states: 'Arunachal Pradesh, Assam',
    pH: 7.3,
    tds: 270,
    lat: 26.2006,
    lng: 92.9376
  },

   { id: 6, name: 'Kaveri', origin: 'Talakaveri, Karnataka', length: '800 km', states: 'Karnataka, Tamil Nadu', pH: 7.6, tds: 300, lat: 11.9416, lng: 79.8083 },
  { id: 7, name: 'Krishna', origin: 'Mahabaleshwar, Maharashtra', length: '1,400 km', states: 'Maharashtra, Karnataka, Telangana, Andhra Pradesh', pH: 7.5, tds: 310, lat: 16.5062, lng: 80.6480 },
  { id: 8, name: 'Mahanadi', origin: 'Sihawa, Chhattisgarh', length: '858 km', states: 'Chhattisgarh, Odisha', pH: 7.7, tds: 280, lat: 20.4625, lng: 85.8828 },
  { id: 9, name: 'Tapti', origin: 'Satpura Range, Madhya Pradesh', length: '724 km', states: 'Madhya Pradesh, Maharashtra, Gujarat', pH: 7.6, tds: 320, lat: 21.1702, lng: 72.8311 },
  { id: 10, name: 'Sabarmati', origin: 'Aravalli Hills, Rajasthan', length: '371 km', states: 'Rajasthan, Gujarat', pH: 7.8, tds: 340, lat: 23.0225, lng: 72.5714 },
  { id: 11, name: 'Musi', origin: 'Anantagiri Hills, Telangana', length: '240 km', states: 'Telangana', pH: 7.4, tds: 420, lat: 17.3850, lng: 78.4867 },
  { id: 12, name: 'Bhagirathi', origin: 'Gangotri Glacier, Uttarakhand', length: '205 km', states: 'Uttarakhand', pH: 7.9, tds: 260, lat: 30.7433, lng: 78.4355 },
  { id: 13, name: 'Alaknanda', origin: 'Satopanth Glacier, Uttarakhand', length: '195 km', states: 'Uttarakhand', pH: 7.8, tds: 270, lat: 30.7333, lng: 79.0667 },
  { id: 14, name: 'Mandovi', origin: 'Western Ghats, Karnataka', length: '77 km', states: 'Goa, Karnataka', pH: 7.5, tds: 280, lat: 15.2993, lng: 74.1240 },
  { id: 15, name: 'Zuari', origin: 'Western Ghats, Karnataka', length: '92 km', states: 'Goa', pH: 7.6, tds: 290, lat: 15.3490, lng: 74.1230 },
  { id: 16, name: 'Periyar', origin: 'Sivagiri Hills, Kerala', length: '244 km', states: 'Kerala', pH: 7.5, tds: 250, lat: 9.9391, lng: 76.2597 },
  { id: 17, name: 'Pamba', origin: 'Pulachimalai Hills, Kerala', length: '176 km', states: 'Kerala', pH: 7.4, tds: 240, lat: 9.5310, lng: 76.7950 },
  { id: 18, name: 'Bharathapuzha', origin: 'Anamalai Hills, Kerala', length: '209 km', states: 'Kerala', pH: 7.5, tds: 230, lat: 10.7867, lng: 76.6548 },
  { id: 19, name: 'Hooghly', origin: 'Bifurcation of Ganga at Farakka', length: '260 km', states: 'West Bengal', pH: 7.6, tds: 320, lat: 22.5726, lng: 88.3639 },
  { id: 20, name: 'Son', origin: 'Amarkantak Plateau, Madhya Pradesh', length: '784 km', states: 'Madhya Pradesh, Uttar Pradesh, Bihar', pH: 7.7, tds: 310, lat: 24.7945, lng: 84.9994 },
  { id: 21, name: 'Chambal', origin: 'Vindhya Range, Madhya Pradesh', length: '965 km', states: 'Madhya Pradesh, Rajasthan, UP', pH: 7.8, tds: 300, lat: 26.4499, lng: 74.6399 },
  { id: 22, name: 'Betwa', origin: 'Vindhya Range, MP', length: '590 km', states: 'Madhya Pradesh, UP', pH: 7.6, tds: 310, lat: 25.4470, lng: 78.5680 },
  { id: 23, name: 'Ken', origin: 'Ahirgawan, MP', length: '427 km', states: 'Madhya Pradesh, UP', pH: 7.5, tds: 300, lat: 24.5290, lng: 80.8355 },
  { id: 24, name: 'Gandak', origin: 'Nepal Himalayas', length: '630 km', states: 'Bihar, UP', pH: 7.4, tds: 290, lat: 26.1520, lng: 84.8760 },
  { id: 25, name: 'Kosi', origin: 'Tibet/Nepal', length: '720 km', states: 'Bihar', pH: 7.5, tds: 280, lat: 26.1220, lng: 86.5970 },
  { id: 26, name: 'Teesta', origin: 'Pahunri Glacier, Sikkim', length: '315 km', states: 'Sikkim, West Bengal', pH: 7.4, tds: 270, lat: 27.0330, lng: 88.2627 },
  { id: 27, name: 'Beas', origin: 'Rohtang Pass, Himachal Pradesh', length: '470 km', states: 'Himachal Pradesh, Punjab', pH: 7.7, tds: 280, lat: 31.6330, lng: 75.3333 },
  { id: 28, name: 'Ravi', origin: 'Kullu Hills, Himachal Pradesh', length: '720 km', states: 'HP, Punjab', pH: 7.6, tds: 300, lat: 32.2730, lng: 75.6520 },
  { id: 29, name: 'Sutlej', origin: 'Rakshastal, Tibet', length: '1,450 km', states: 'HP, Punjab', pH: 7.5, tds: 320, lat: 31.1048, lng: 77.1734 },
  { id: 30, name: 'Chenab', origin: 'Baralacha Pass, Himachal Pradesh', length: '960 km', states: 'HP, J&K', pH: 7.4, tds: 300, lat: 32.7266, lng: 75.0000 },
  { id: 31, name: 'Indus', origin: 'Tibet Plateau', length: '3,180 km', states: 'Ladakh', pH: 7.3, tds: 250, lat: 34.1526, lng: 77.5770 },
  { id: 32, name: 'Luni', origin: 'Pushkar Valley, Rajasthan', length: '495 km', states: 'Rajasthan', pH: 7.9, tds: 600, lat: 25.3445, lng: 74.6380 },
  { id: 33, name: 'Pench', origin: 'Satpura Range, MP', length: '180 km', states: 'MP, Maharashtra', pH: 7.6, tds: 310, lat: 21.6480, lng: 79.6440 },
  { id: 34, name: 'Wainganga', origin: 'Mahadeo Hills, MP', length: '579 km', states: 'MP, Maharashtra', pH: 7.5, tds: 290, lat: 21.2700, lng: 79.0000 },
  { id: 35, name: 'Wardha', origin: 'Satpura Range, MP', length: '528 km', states: 'MP, Maharashtra', pH: 7.5, tds: 300, lat: 20.7453, lng: 78.6022 },
  { id: 36, name: 'Bhima', origin: 'Bhima Shankar Hills, Maharashtra', length: '861 km', states: 'Maharashtra, Karnataka, Telangana', pH: 7.5, tds: 310, lat: 17.2530, lng: 75.9710 },
  { id: 37, name: 'Manjira', origin: 'Balaghat Range, Maharashtra', length: '724 km', states: 'Maharashtra, Telangana', pH: 7.4, tds: 290, lat: 18.4200, lng: 77.3600 },
  { id: 38, name: 'Ghaghara', origin: 'Tibet Plateau', length: '1,080 km', states: 'UP, Bihar', pH: 7.5, tds: 280, lat: 26.2920, lng: 83.4700 },
  { id: 39, name: 'Damanganga', origin: 'Western Ghats, Maharashtra', length: '131 km', states: 'Maharashtra, Gujarat', pH: 7.6, tds: 300, lat: 20.2720, lng: 73.0100 },
  { id: 40, name: 'Sharavathi', origin: 'Shimoga, Karnataka', length: '128 km', states: 'Karnataka', pH: 7.4, tds: 260, lat: 14.2140, lng: 74.8300 },
  { id: 41, name: 'Kabini', origin: 'Wayanad, Kerala', length: '240 km', states: 'Kerala, Karnataka', pH: 7.5, tds: 280, lat: 11.7000, lng: 76.3660 },
  { id: 42, name: 'Hemavathi', origin: 'Western Ghats, Karnataka', length: '245 km', states: 'Karnataka', pH: 7.6, tds: 270, lat: 12.9480, lng: 76.0000 },
  { id: 43, name: 'Chaliyar', origin: 'Elambalari Hills, Kerala', length: '169 km', states: 'Kerala', pH: 7.4, tds: 240, lat: 11.2510, lng: 75.7800 },
  { id: 44, name: 'Kalindi', origin: 'Sundarbans, WB', length: '120 km', states: 'West Bengal', pH: 7.8, tds: 350, lat: 21.9497, lng: 88.7520 },
  { id: 45, name: 'Vembanad Lake', origin: 'Kerala Backwaters', length: '96 km', states: 'Kerala', pH: 7.5, tds: 230, lat: 9.6167, lng: 76.4333 },
  { id: 46, name: 'Chilika Lake', origin: 'Odisha Coast', length: '64 km', states: 'Odisha', pH: 7.7, tds: 280, lat: 19.7580, lng: 85.4830 },
  { id: 47, name: 'Sambhar Lake', origin: 'Aravalli Hills, Rajasthan', length: '22 km', states: 'Rajasthan', pH: 8.1, tds: 1800, lat: 26.9385, lng: 75.1975 },
  { id: 48, name: 'Pulicat Lake', origin: 'Andhra Coast', length: '60 km', states: 'Andhra Pradesh, Tamil Nadu', pH: 7.8, tds: 350, lat: 13.4160, lng: 80.1500 },
  { id: 49, name: 'Loktak Lake', origin: 'Manipur', length: '35 km', states: 'Manipur', pH: 7.6, tds: 270, lat: 24.4970, lng: 93.7830 },
  { id: 50, name: 'Dal Lake', origin: 'Srinagar, J&K', length: '18 km', states: 'Jammu & Kashmir', pH: 7.5, tds: 240, lat: 34.0837, lng: 74.7973 },
  { id: 51, name: 'Wular Lake', origin: 'Bandipora, J&K', length: '24 km', states: 'Jammu & Kashmir', pH: 7.4, tds: 260, lat: 34.3500, lng: 74.5667 },
  { id: 52, name: 'Pangong Lake', origin: 'Ladakh', length: '134 km', states: 'Ladakh', pH: 9.0, tds: 1800, lat: 33.7490, lng: 78.6330 },
  { id: 53, name: 'Tsomgo Lake', origin: 'Sikkim', length: '1 km', states: 'Sikkim', pH: 7.2, tds: 260, lat: 27.3750, lng: 88.7640 },
  { id: 54, name: 'Pichola Lake', origin: 'Udaipur, Rajasthan', length: '4 km', states: 'Rajasthan', pH: 7.8, tds: 340, lat: 24.5710, lng: 73.6850 },
  { id: 55, name: 'Pushkar Lake', origin: 'Ajmer, Rajasthan', length: '2 km', states: 'Rajasthan', pH: 8.0, tds: 900, lat: 26.4890, lng: 74.5510 },
  { id: 56, name: 'Vellar River', origin: 'Kalrayan Hills, TN', length: '150 km', states: 'Tamil Nadu', pH: 7.6, tds: 310, lat: 11.5000, lng: 79.5000 },
  { id: 57, name: 'Pennar River', origin: 'Nandi Hills, Karnataka', length: '597 km', states: 'Karnataka, Andhra Pradesh', pH: 7.5, tds: 320, lat: 14.5500, lng: 79.9830 },
]

const WaterAtlas = () => {
  const [selectedRiver, setSelectedRiver] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRivers = rivers.filter(river =>
    river.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatus = (pH, tds) => {
    if (pH >= 6.8 && pH <= 8.2 && tds < 350) return { text: 'Safe', color: 'green' }
    if (pH >= 6.5 && pH <= 8.5 && tds < 500) return { text: 'Moderate', color: 'yellow' }
    return { text: 'Needs Attention', color: 'red' }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-water-blue mb-4 text-center">
          🗺️ India Water Atlas
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Explore major rivers and water bodies across India
        </p>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search rivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-water-blue focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRivers.map(river => {
            const status = getStatus(river.pH, river.tds)
            return (
              <div
                key={river.id}
                onClick={() => setSelectedRiver(river)}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-water-blue">{river.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${status.color}-100 text-${status.color}-700`}>
                    {status.text}
                  </span>
                </div>

                <div className="space-y-2 text-gray-600">
                  <p><strong>Origin:</strong> {river.origin}</p>
                  <p><strong>Length:</strong> {river.length}</p>
                  <p><strong>States:</strong> {river.states}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">pH Level</p>
                    <p className="text-xl font-bold text-water-blue">{river.pH}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">TDS (ppm)</p>
                    <p className="text-xl font-bold text-water-blue">{river.tds}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm font-semibold text-blue-700">
                    🚀 BioLink Node Coming Soon
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {selectedRiver && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRiver(null)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-water-blue mb-4">{selectedRiver.name}</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Origin:</strong> {selectedRiver.origin}</p>
                <p><strong>Length:</strong> {selectedRiver.length}</p>
                <p><strong>Flows through:</strong> {selectedRiver.states}</p>
                <p><strong>pH:</strong> {selectedRiver.pH}</p>
                <p><strong>TDS:</strong> {selectedRiver.tds} ppm</p>
              </div>
              <button
                onClick={() => setSelectedRiver(null)}
                className="mt-6 w-full bg-water-blue text-white py-3 rounded-lg font-semibold hover:bg-water-dark transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WaterAtlas

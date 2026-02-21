// Mock parking data used across the app
export const PARKINGS = [
  {
    id: '1',
    name: 'Parkly Centro',
    address: 'Via Roma 10',
    city: 'Milano',
    lat: 45.4641,
    lng: 9.1919,
    pricePerHour: 2.5,
    pricePerDay: 18,
    totalSpots: 120,
    availableSpots: 34,
    rating: 4.7,
    amenities: ['Coperto', 'Videosorveglianza', 'Accesso H24'],
    images: [],
  },
  {
    id: '2',
    name: 'Parkly Stazione',
    address: 'Piazza Duca d\'Aosta 1',
    city: 'Milano',
    lat: 45.4839,
    lng: 9.2045,
    pricePerHour: 3.0,
    pricePerDay: 22,
    totalSpots: 200,
    availableSpots: 12,
    rating: 4.3,
    amenities: ['Scoperto', 'Videosorveglianza', 'Colonnine EV'],
    images: [],
  },
  {
    id: '3',
    name: 'Parkly Navigli',
    address: 'Via Vigevano 14',
    city: 'Milano',
    lat: 45.4503,
    lng: 9.1741,
    pricePerHour: 1.8,
    pricePerDay: 14,
    totalSpots: 60,
    availableSpots: 28,
    rating: 4.9,
    amenities: ['Coperto', 'Accesso H24'],
    images: [],
  },
  {
    id: '4',
    name: 'Parkly Porta Venezia',
    address: 'Corso Buenos Aires 22',
    city: 'Milano',
    lat: 45.4773,
    lng: 9.2097,
    pricePerHour: 2.2,
    pricePerDay: 16,
    totalSpots: 80,
    availableSpots: 5,
    rating: 4.1,
    amenities: ['Coperto', 'Accesso H24', 'Colonnine EV'],
    images: [],
  },
  {
    id: '5',
    name: 'Parkly Duomo',
    address: 'Via Torino 3',
    city: 'Milano',
    lat: 45.4654,
    lng: 9.1859,
    pricePerHour: 4.0,
    pricePerDay: 30,
    totalSpots: 50,
    availableSpots: 2,
    rating: 4.8,
    amenities: ['Coperto', 'Videosorveglianza', 'Valet'],
    images: [],
  },
]

export function getParkingById(id) {
  return PARKINGS.find((p) => p.id === id) ?? null
}

export function searchParkings({ city, maxPrice, amenities = [], query = '' }) {
  return PARKINGS.filter((p) => {
    if (city && !p.city.toLowerCase().includes(city.toLowerCase())) return false
    if (maxPrice && p.pricePerHour > maxPrice) return false
    if (amenities.length > 0 && !amenities.every((a) => p.amenities.includes(a))) return false
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.address.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })
}

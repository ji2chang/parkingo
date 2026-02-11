import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import CityMap from './pages/CityMap'
import ParkingZoneMap from './pages/ParkingZoneMap'
import Booking from './pages/Booking'
import ParkingList from './pages/ParkingList'

function App() {
  return (
    <Routes>
      {/* Login route without header/footer */}
      <Route path="/login" element={<Login />} />

      {/* Main routes with layout */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/city-map" element={<CityMap />} />
                <Route path="/parking/:id" element={<ParkingZoneMap />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/parkings" element={<ParkingList />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  )
}

export default App

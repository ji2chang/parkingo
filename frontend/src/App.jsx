import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import ParkingList from './pages/ParkingList'

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Parkingo — Frontend</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/parkings">Parkings</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parkings" element={<ParkingList />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

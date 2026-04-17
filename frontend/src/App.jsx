import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/MainLayout'
import { ToastProvider } from './hooks/useToast'
import { BookingProvider } from './hooks/useBooking'
import { AuthProvider } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/home'
import { LoginPage } from './pages/Login'
import { ProfilePage } from './pages/Profile'
import { AdminDashboard } from './pages/AdminDashboard'
import { SearchPage } from './pages/SearchPage'
import { MapPage } from './pages/MapPage'
import { BookingPage } from './pages/BookingPage'
import { BookingStartPage } from './pages/BookingStartPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { ManagePage } from './pages/ManagePage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SigninPage } from './pages/Signin'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BookingProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="booking" element={<BookingStartPage />} />
                <Route path="booking/:parkingId" element={<BookingPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="map" element={<MapPage />} />
                <Route path="signin" element={<SigninPage />} />
                <Route path="confirmation/:code" element={<ConfirmationPage />} />
                <Route path="manage/:code" element={<ManagePage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import KanjiExplorer from './pages/KanjiExplorer'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/explore" element={<KanjiExplorer />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

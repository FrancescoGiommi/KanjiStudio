import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import KanjiExplorer from './pages/KanjiExplorer'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import QuizPage from './pages/QuizPage'
import ReviewPage from './pages/ReviewPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/explore" element={<ProtectedRoute><KanjiExplorer /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

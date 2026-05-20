import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import KanjiExplorer from './pages/KanjiExplorer'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<KanjiExplorer />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

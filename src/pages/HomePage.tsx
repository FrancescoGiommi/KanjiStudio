import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import LandingPage from './LandingPage'
import Dashboard from './Dashboard'

export default function HomePage() {
  const { user } = useAuth()
  return (
    <motion.div
      key={user ? 'dashboard' : 'landing'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {user ? <Dashboard /> : <LandingPage />}
    </motion.div>
  )
}

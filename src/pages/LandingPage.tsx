import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Zap, TrendingUp, ChevronRight } from 'lucide-react'
import AuthModal from '../components/AuthModal'

const PREVIEW_KANJI = ['日', '月', '火', '水', '木', '金', '土', '山', '川', '人', '口', '手', '目', '耳', '足']

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Tutti i livelli JLPT',
    description: 'Studia i kanji dal livello N5 fino al N1, con significati, letture on e kun, ed esempi.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Quiz interattivi',
    description: 'Metti alla prova la tua memoria con quiz a scelta multipla e flashcard intelligenti.',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Traccia i progressi',
    description: 'Streak giornalieri, statistiche, badge e grafici per mantenerti motivato.',
    color: 'from-green-400 to-teal-500',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          KanjiStudio
        </span>
        <button
          onClick={() => setShowAuth(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-sm font-medium"
        >
          Accedi
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-8xl mb-6 select-none"
        >
          漢
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl font-extrabold mb-4 leading-tight"
        >
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Impara il giapponese, un kanji alla volta.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-lg text-slate-400 mb-8 max-w-xl"
        >
          Un'app moderna per imparare tutti i kanji dei livelli N5–N1 con quiz, flashcard e statistiche personali.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAuth(true)}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg shadow-lg shadow-indigo-900/40 transition-all"
        >
          Inizia gratis <ChevronRight size={20} />
        </motion.button>
      </section>

      {/* Kanji preview grid */}
      <section className="py-10 overflow-hidden">
        <motion.div
          className="flex gap-4 px-6 flex-wrap justify-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {PREVIEW_KANJI.map((k) => (
            <motion.div
              key={k}
              variants={itemVariants}
              whileHover={{ scale: 1.15, rotate: 3 }}
              className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-2xl font-bold cursor-default select-none hover:bg-indigo-600/30 hover:border-indigo-400 transition-colors"
            >
              {k}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col gap-4 hover:border-indigo-500/50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA finale */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto rounded-3xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 p-10"
        >
          <p className="text-3xl font-extrabold mb-3">Pronto a iniziare?</p>
          <p className="text-slate-400 mb-6">Crea il tuo account gratuito e inizia a studiare oggi.</p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-colors"
          >
            Registrati gratis
          </button>
        </motion.div>
      </section>
    </div>
  )
}

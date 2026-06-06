import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Star, BookOpen, Zap, RotateCcw, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import kanjiData, { LEVEL_COUNTS, TOTAL_COUNT } from '../data/kanjiData'
import { countDueReviews } from '../srs/reviews'

const LEVEL_META = [
  { level: 'N5', jlpt: 5 as const, color: 'from-green-400 to-emerald-500' },
  { level: 'N4', jlpt: 4 as const, color: 'from-teal-400 to-cyan-500' },
  { level: 'N3', jlpt: 3 as const, color: 'from-blue-400 to-indigo-500' },
  { level: 'N2', jlpt: 2 as const, color: 'from-purple-400 to-violet-500' },
  { level: 'N1', jlpt: 1 as const, color: 'from-pink-500 to-rose-500' },
]

const KANJI_OF_THE_DAY = {
  kanji: '愛',
  meaning: 'Amore, affetto',
  on: 'アイ',
  kun: 'いと.しい、かな.しい',
  level: 'N3',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Dashboard() {
  const { user, logout, learnedKanji, streak } = useAuth()
  const navigate = useNavigate()
  const [dueCount, setDueCount] = useState<number | null>(null)

  useEffect(() => {
    if (!user) return
    countDueReviews(user.uid, Date.now()).then(setDueCount).catch(() => setDueCount(null))
  }, [user])

  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'Utente'

  const jlptLevels = LEVEL_META.map(({ level, jlpt, color }) => {
    const inDataset = kanjiData.filter((k) => k.jlpt === jlpt)
    const learned = inDataset.filter((k) => learnedKanji.has(k.character)).length
    return { level, total: LEVEL_COUNTS[jlpt], learned, color }
  })

  const totalLearned = jlptLevels.reduce((s, l) => s + l.learned, 0)

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-white/10">
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          KanjiStudio
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{displayName}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={16} /> Esci
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Greeting + streak */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl font-extrabold">
              Ciao, {displayName}! 👋
            </h1>
            <p className="text-slate-400 mt-1">Oggi è il momento di studiare. Continua così!</p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-900/30 font-bold text-lg w-fit"
          >
            <Flame size={22} /> {streak} {streak === 1 ? 'giorno' : 'giorni'} di streak
          </motion.div>
        </motion.div>

        {/* Totale kanji imparati */}
        <motion.div
          variants={itemVariants}
          className="mb-6 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
        >
          <span className="text-slate-400 text-sm">Kanji imparati totali</span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {totalLearned} <span className="text-base font-normal text-slate-500">/ {TOTAL_COUNT}</span>
          </span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Kanji del giorno */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 p-6 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between text-sm text-indigo-300 font-semibold">
              <span className="flex items-center gap-1"><Star size={14} /> Kanji del giorno</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600/50 text-xs">{KANJI_OF_THE_DAY.level}</span>
            </div>
            <div className="text-8xl text-center font-bold py-4 select-none">
              {KANJI_OF_THE_DAY.kanji}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{KANJI_OF_THE_DAY.meaning}</p>
              <p className="text-sm text-slate-400 mt-1">On: <span className="text-white">{KANJI_OF_THE_DAY.on}</span></p>
              <p className="text-sm text-slate-400">Kun: <span className="text-white">{KANJI_OF_THE_DAY.kun}</span></p>
            </div>
          </motion.div>

          {/* Progressi per livello */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-400" /> Progressi per livello
            </h2>
            <div className="flex flex-col gap-4">
              {jlptLevels.map(({ level, total, learned, color }) => {
                const pct = Math.round((learned / total) * 100)
                return (
                  <div key={level}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{level}</span>
                      <span className="text-slate-400">{learned} / {total} kanji — {pct}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-white/10">
                      <motion.div
                        className={`h-3 rounded-full bg-gradient-to-r ${color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Azioni rapide */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: BookOpen, label: 'Studia nuovi kanji', sublabel: 'Esplora per livello', color: 'from-indigo-600 to-purple-600', action: () => navigate('/explore') },
              { icon: Zap, label: 'Quiz veloce', sublabel: '10 domande random', color: 'from-yellow-500 to-orange-500', action: () => navigate('/quiz') },
              { icon: RotateCcw, label: 'Ripasso', sublabel: dueCount === null ? 'Kanji da ripassare oggi' : dueCount === 0 ? 'Nessun ripasso per ora' : `${dueCount} kanji da ripassare`, color: 'from-green-500 to-teal-500', action: () => navigate('/review') },
            ].map(({ icon: Icon, label, sublabel, color, action }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={action}
                className={`flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br ${color} shadow-lg text-left font-bold transition-all`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-base font-bold">{label}</p>
                  <p className="text-xs font-normal opacity-80">{sublabel}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

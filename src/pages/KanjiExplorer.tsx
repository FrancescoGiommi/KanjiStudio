import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import kanjiData, { getKanjiByLevel, searchKanji, type Kanji } from '../data/kanjiData'
import KanjiCard from '../components/KanjiCard'
import KanjiDetailModal from '../components/KanjiDetailModal'

type Level = 1 | 2 | 3 | 4 | 5

const LEVELS: { value: Level; label: string; color: string }[] = [
  { value: 5, label: 'N5', color: 'from-green-400 to-emerald-500' },
  { value: 4, label: 'N4', color: 'from-teal-400 to-cyan-500' },
  { value: 3, label: 'N3', color: 'from-blue-400 to-indigo-500' },
  { value: 2, label: 'N2', color: 'from-purple-400 to-violet-500' },
  { value: 1, label: 'N1', color: 'from-pink-500 to-rose-500' },
]

const TOTAL_BY_LEVEL: Record<Level, number> = { 5: 103, 4: 181, 3: 361, 2: 367, 1: 1232 }

export default function KanjiExplorer() {
  const navigate = useNavigate()
  const [activeLevel, setActiveLevel] = useState<Level>(5)
  const [query, setQuery] = useState('')
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null)

  const displayed = useMemo(() => {
    if (query.trim()) return searchKanji(query, activeLevel)
    return getKanjiByLevel(activeLevel)
  }, [query, activeLevel])

  const activeLevelData = LEVELS.find((l) => l.value === activeLevel)!
  const totalInDataset = kanjiData.filter((k) => k.jlpt === activeLevel).length
  const totalJlpt = TOTAL_BY_LEVEL[activeLevel]

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0f0f1a]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            KanjiStudio
          </span>
        </div>

        {/* Level tabs */}
        <div className="max-w-6xl mx-auto px-6 pb-4 flex gap-2 overflow-x-auto">
          {LEVELS.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => { setActiveLevel(value); setQuery('') }}
              className={`relative px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                ${activeLevel === value
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Level info + search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <span className={`bg-gradient-to-r ${activeLevelData.color} bg-clip-text text-transparent`}>
                Livello {activeLevelData.label}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {totalInDataset} kanji nel dataset · {totalJlpt} totali nel JLPT
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca kanji, significato, lettura…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Grid */}
        {displayed.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-3">🔍</p>
            <p>Nessun kanji trovato per "{query}"</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          >
            {displayed.map((k) => (
              <motion.div
                key={k.character}
                variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
              >
                <KanjiCard kanji={k} onClick={setSelectedKanji} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Dataset note */}
        <p className="text-center text-xs text-slate-600 mt-10">
          Dataset mock — verrà sostituito con il dataset completo KanjiAPI N1–N5
        </p>
      </main>

      <KanjiDetailModal kanji={selectedKanji} onClose={() => setSelectedKanji(null)} />
    </div>
  )
}

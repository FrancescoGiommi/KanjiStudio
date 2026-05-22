import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import kanjiData, { getKanjiByLevel, searchKanji, type Kanji } from '../data/kanjiData'
import KanjiCard from '../components/KanjiCard'
import KanjiDetailModal from '../components/KanjiDetailModal'
import { useAuth } from '../contexts/AuthContext'

type Level = 1 | 2 | 3 | 4 | 5
type StatusFilter = 'all' | 'learned' | 'unlearned'
type StrokeFilter = 'all' | '1-5' | '6-10' | '11-15' | '16+'
type GradeFilter = 'all' | 'elementary' | 'secondary'
type SortBy = 'default' | 'strokes-asc' | 'strokes-desc'

const LEVELS: { value: Level; label: string; color: string }[] = [
  { value: 5, label: 'N5', color: 'from-green-400 to-emerald-500' },
  { value: 4, label: 'N4', color: 'from-teal-400 to-cyan-500' },
  { value: 3, label: 'N3', color: 'from-blue-400 to-indigo-500' },
  { value: 2, label: 'N2', color: 'from-purple-400 to-violet-500' },
  { value: 1, label: 'N1', color: 'from-pink-500 to-rose-500' },
]

const TOTAL_BY_LEVEL: Record<Level, number> = { 5: 103, 4: 181, 3: 361, 2: 367, 1: 1232 }

function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{label}</span>
      <div className="flex gap-1 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap
              ${value === opt.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function KanjiExplorer() {
  const navigate = useNavigate()
  const { learnedKanji, toggleLearned, user } = useAuth()
  const [activeLevel, setActiveLevel] = useState<Level>(5)
  const [query, setQuery] = useState('')
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [strokeFilter, setStrokeFilter] = useState<StrokeFilter>('all')
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('default')

  const displayed = useMemo(() => {
    let pool = query.trim() ? searchKanji(query, activeLevel) : getKanjiByLevel(activeLevel)

    if (statusFilter === 'learned')   pool = pool.filter((k) => learnedKanji.has(k.character))
    if (statusFilter === 'unlearned') pool = pool.filter((k) => !learnedKanji.has(k.character))

    if (strokeFilter === '1-5')   pool = pool.filter((k) => k.stroke_count <= 5)
    if (strokeFilter === '6-10')  pool = pool.filter((k) => k.stroke_count >= 6  && k.stroke_count <= 10)
    if (strokeFilter === '11-15') pool = pool.filter((k) => k.stroke_count >= 11 && k.stroke_count <= 15)
    if (strokeFilter === '16+')   pool = pool.filter((k) => k.stroke_count >= 16)

    if (gradeFilter === 'elementary') pool = pool.filter((k) => k.grade != null && k.grade >= 1 && k.grade <= 6)
    if (gradeFilter === 'secondary')  pool = pool.filter((k) => k.grade != null && k.grade > 6)

    if (sortBy === 'strokes-asc')  pool = [...pool].sort((a, b) => a.stroke_count - b.stroke_count)
    if (sortBy === 'strokes-desc') pool = [...pool].sort((a, b) => b.stroke_count - a.stroke_count)

    return pool
  }, [query, activeLevel, statusFilter, strokeFilter, gradeFilter, sortBy, learnedKanji])

  const activeLevelData = LEVELS.find((l) => l.value === activeLevel)!
  const totalInDataset = kanjiData.filter((k) => k.jlpt === activeLevel).length
  const totalJlpt = TOTAL_BY_LEVEL[activeLevel]
  const hasActiveFilters = statusFilter !== 'all' || strokeFilter !== 'all' || gradeFilter !== 'all' || sortBy !== 'default'

  const resetFilters = () => {
    setStatusFilter('all')
    setStrokeFilter('all')
    setGradeFilter('all')
    setSortBy('default')
  }

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
              onClick={() => { setActiveLevel(value); setQuery(''); resetFilters() }}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-extrabold">
              <span className={`bg-gradient-to-r ${activeLevelData.color} bg-clip-text text-transparent`}>
                Livello {activeLevelData.label}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              <span className="text-white font-medium">{displayed.length}</span> kanji
              {hasActiveFilters ? ' (filtrati)' : ''} · {totalInDataset} nel dataset · {totalJlpt} totali JLPT
            </p>
          </div>

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

        {/* Filter bar */}
        <div className="flex flex-wrap items-start gap-x-5 gap-y-3 mb-6 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
          <div className="flex items-center gap-1.5 text-slate-500 pt-1">
            <SlidersHorizontal size={13} />
            <span className="text-xs font-semibold uppercase tracking-wider">Filtri</span>
          </div>

          {/* Stato + Ordina impilati nella stessa colonna */}
          <div className="flex flex-col gap-2">
            {user && (
              <FilterChips
                label="Stato"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all',       label: 'Tutti' },
                  { value: 'unlearned', label: 'Da imparare' },
                  { value: 'learned',   label: 'Imparati' },
                ]}
              />
            )}
            <FilterChips
              label="Ordina"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'default',      label: 'Default' },
                { value: 'strokes-asc',  label: 'Tratti ↑' },
                { value: 'strokes-desc', label: 'Tratti ↓' },
              ]}
            />
          </div>

          <FilterChips
            label="Tratti"
            value={strokeFilter}
            onChange={setStrokeFilter}
            options={[
              { value: 'all',   label: 'Tutti' },
              { value: '1-5',   label: '1–5' },
              { value: '6-10',  label: '6–10' },
              { value: '11-15', label: '11–15' },
              { value: '16+',   label: '16+' },
            ]}
          />

          <FilterChips
            label="Classe"
            value={gradeFilter}
            onChange={setGradeFilter}
            options={[
              { value: 'all',        label: 'Tutti' },
              { value: 'elementary', label: 'Elementare' },
              { value: 'secondary',  label: 'Secondaria' },
            ]}
          />

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-all ml-auto"
            >
              <X size={11} /> Reset
            </button>
          )}
        </div>

        {/* Grid */}
        {displayed.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-3">🔍</p>
            <p>{query ? `Nessun kanji trovato per "${query}"` : 'Nessun kanji con i filtri selezionati'}</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm underline">
                Rimuovi filtri
              </button>
            )}
          </div>
        ) : (
          <motion.div
            key={`${activeLevel}-${statusFilter}-${strokeFilter}-${gradeFilter}-${sortBy}`}
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.02 } } }}
          >
            {displayed.map((k) => (
              <motion.div
                key={k.character}
                variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
              >
                <KanjiCard kanji={k} onClick={setSelectedKanji} learned={learnedKanji.has(k.character)} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <p className="text-center text-xs text-slate-600 mt-10">
          Dataset KanjiAPI · N1–N5 completo
        </p>
      </main>

      <KanjiDetailModal
        kanji={selectedKanji}
        onClose={() => setSelectedKanji(null)}
        isLearned={selectedKanji ? learnedKanji.has(selectedKanji.character) : false}
        onToggleLearned={user && selectedKanji ? () => toggleLearned(selectedKanji.character, selectedKanji.jlpt) : undefined}
      />
    </div>
  )
}

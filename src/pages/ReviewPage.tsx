import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Eye, CheckCircle2, PartyPopper } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import kanjiData, { type Kanji } from '../data/kanjiData'
import { getDueReviews, gradeReview, type ReviewCard } from '../srs/reviews'
import { previewInterval, type Grade } from '../srs/sm2'

// Lookup veloce da carattere -> dati completi del kanji (significati, letture, ...).
const KANJI_BY_CHAR = new Map<string, Kanji>(kanjiData.map((k) => [k.character, k]))

const GRADES: { value: Grade; label: string; color: string }[] = [
  { value: 'again', label: 'Di nuovo', color: 'bg-red-500/20 border-red-400 text-red-200 hover:bg-red-500/30' },
  { value: 'hard', label: 'Difficile', color: 'bg-orange-500/20 border-orange-400 text-orange-200 hover:bg-orange-500/30' },
  { value: 'good', label: 'Bene', color: 'bg-green-500/20 border-green-400 text-green-200 hover:bg-green-500/30' },
  { value: 'easy', label: 'Facile', color: 'bg-indigo-500/20 border-indigo-400 text-indigo-200 hover:bg-indigo-500/30' },
]

function meaningOf(kanji: Kanji): string {
  return kanji.meanings_it?.[0] ?? kanji.meanings[0] ?? '—'
}

export default function ReviewPage() {
  const navigate = useNavigate()
  const { user, recordStudyActivity } = useAuth()

  const [loading, setLoading] = useState(true)
  const [queue, setQueue] = useState<ReviewCard[]>([])
  const [revealed, setRevealed] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    let active = true
    getDueReviews(user.uid, Date.now())
      .then((cards) => {
        if (!active) return
        // Tieni solo le carte che possiamo effettivamente mostrare dal dataset.
        setQueue(cards.filter((c) => KANJI_BY_CHAR.has(c.character)))
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [user, navigate])

  const current = queue[0]
  const kanji = current ? KANJI_BY_CHAR.get(current.character) : undefined

  const previews = useMemo(() => {
    if (!current) return {} as Record<Grade, string>
    const now = Date.now()
    return GRADES.reduce(
      (acc, g) => ({ ...acc, [g.value]: previewInterval(current, g.value, now) }),
      {} as Record<Grade, string>,
    )
  }, [current])

  const handleGrade = async (grade: Grade) => {
    if (!user || !current || busy) return
    setBusy(true)
    const now = Date.now()
    const updated = await gradeReview(user.uid, current, grade, now)
    if (reviewedCount === 0) void recordStudyActivity()
    setReviewedCount((c) => c + 1)
    setRevealed(false)
    setQueue((prev) => {
      const rest = prev.slice(1)
      // Una carta sbagliata torna più avanti nella stessa sessione.
      return grade === 'again' ? [...rest, updated] : rest
    })
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <nav className="flex items-center gap-4 px-6 py-4 max-w-6xl mx-auto border-b border-white/10">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Torna alla dashboard"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          KanjiStudio
        </span>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <RotateCcw size={22} />
          </div>
          <div>
            <p className="text-sm text-green-300 font-semibold">Ripasso</p>
            <h1 className="text-2xl font-extrabold">
              {loading ? 'Carico…' : current ? `${queue.length} da ripassare` : 'Tutto fatto!'}
            </h1>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-10 text-center text-slate-400">
            Carico le tue flashcard…
          </div>
        )}

        {!loading && !current && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-10 text-center"
          >
            <PartyPopper className="mx-auto text-green-400 mb-4" size={48} />
            <h2 className="text-xl font-extrabold mb-2">
              {reviewedCount > 0 ? `Hai ripassato ${reviewedCount} kanji!` : 'Nessun ripasso per ora'}
            </h2>
            <p className="text-slate-400 mb-6">
              {reviewedCount > 0
                ? 'Torna più tardi per i prossimi kanji dovuti.'
                : 'Marca dei kanji come imparati nell’Esplora per iniziare a ripassarli.'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/explore')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold hover:opacity-90 transition-opacity"
              >
                Esplora kanji
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white font-bold transition-all"
              >
                Dashboard
              </button>
            </div>
          </motion.section>
        )}

        {!loading && current && kanji && (
          <>
            <div className="h-2 rounded-full bg-white/10 mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-teal-500"
                animate={{
                  width: `${Math.round((reviewedCount / (reviewedCount + queue.length)) * 100)}%`,
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.section
                key={current.character + (revealed ? '-back' : '-front')}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-8"
              >
                <div className="flex items-center justify-between text-sm mb-6">
                  <span className="text-orange-300 font-semibold">N{current.jlpt}</span>
                  <span className="text-slate-500">{kanji.stroke_count} tratti</span>
                </div>

                <div className="text-center mb-6">
                  <div className="text-8xl sm:text-9xl font-bold select-none">{kanji.character}</div>
                </div>

                {revealed ? (
                  <div className="text-center">
                    <p className="text-2xl font-extrabold mb-3">{meaningOf(kanji)}</p>
                    <p className="text-sm text-slate-400">
                      On: <span className="text-white">{kanji.readings_on[0] ?? '—'}</span>
                      {'  ·  '}
                      Kun: <span className="text-white">{kanji.readings_kun[0] ?? '—'}</span>
                    </p>
                    {kanji.meanings_it && kanji.meanings_it.length > 1 && (
                      <p className="text-sm text-slate-500 mt-2">{kanji.meanings_it.slice(0, 4).join(', ')}</p>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                      {GRADES.map((g) => (
                        <button
                          key={g.value}
                          disabled={busy}
                          onClick={() => handleGrade(g.value)}
                          className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border font-bold transition-all disabled:opacity-50 ${g.color}`}
                        >
                          <span>{g.label}</span>
                          <span className="text-xs font-normal opacity-70">{previews[g.value]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setRevealed(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 font-bold hover:opacity-90 transition-opacity"
                  >
                    <Eye size={18} />
                    Mostra risposta
                  </button>
                )}
              </motion.section>
            </AnimatePresence>

            <p className="text-center text-sm text-slate-500 mt-5 flex items-center justify-center gap-1">
              <CheckCircle2 size={14} className="text-green-400" />
              {reviewedCount} ripassati in questa sessione
            </p>
          </>
        )}
      </main>
    </div>
  )
}

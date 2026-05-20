import { motion, AnimatePresence } from 'framer-motion'
import { X, Brush } from 'lucide-react'
import type { Kanji } from '../data/kanjiData'

const LEVEL_COLORS: Record<number, string> = {
  5: 'from-green-400 to-emerald-500',
  4: 'from-teal-400 to-cyan-500',
  3: 'from-blue-400 to-indigo-500',
  2: 'from-purple-400 to-violet-500',
  1: 'from-pink-500 to-rose-500',
}

interface KanjiDetailModalProps {
  kanji: Kanji | null
  onClose: () => void
}

export default function KanjiDetailModal({ kanji, onClose }: KanjiDetailModalProps) {
  return (
    <AnimatePresence>
      {kanji && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="bg-[#1a1a2e] border border-white/10 rounded-3xl shadow-2xl p-8 w-full max-w-md pointer-events-auto relative">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* JLPT badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${LEVEL_COLORS[kanji.jlpt]} text-white`}>
                  N{kanji.jlpt}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Brush size={12} /> {kanji.stroke_count} tratti
                </span>
              </div>

              {/* Kanji */}
              <div className={`text-center text-9xl font-bold py-4 bg-gradient-to-br ${LEVEL_COLORS[kanji.jlpt]} bg-clip-text text-transparent select-none`}>
                {kanji.character}
              </div>

              {/* Meanings */}
              <div className="mt-4 mb-6 text-center flex flex-col gap-1">
                <p className="text-xl font-bold text-white capitalize">
                  {kanji.meanings_it.join(', ')}
                </p>
                <p className="text-base text-indigo-300">
                  {kanji.meanings_ja.join('・')}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {kanji.meanings.join(', ')}
                </p>
              </div>

              {/* Readings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">On'yomi</p>
                  <div className="flex flex-wrap gap-2">
                    {kanji.readings_on.length > 0
                      ? kanji.readings_on.map((r) => (
                          <span key={r} className="px-2 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 text-sm font-medium">
                            {r}
                          </span>
                        ))
                      : <span className="text-slate-500 text-sm">—</span>
                    }
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Kun'yomi</p>
                  <div className="flex flex-wrap gap-2">
                    {kanji.readings_kun.length > 0
                      ? kanji.readings_kun.map((r) => (
                          <span key={r} className="px-2 py-1 rounded-lg bg-purple-600/30 text-purple-300 text-sm font-medium">
                            {r}
                          </span>
                        ))
                      : <span className="text-slate-500 text-sm">—</span>
                    }
                  </div>
                </div>
              </div>

              {/* Grade */}
              {kanji.grade && (
                <p className="mt-4 text-center text-xs text-slate-500">
                  Classe scolastica: {kanji.grade}° anno
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

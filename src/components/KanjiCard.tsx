import { motion } from 'framer-motion'
import type { Kanji } from '../data/kanjiData'

const LEVEL_COLORS: Record<number, string> = {
  5: 'from-green-400 to-emerald-500',
  4: 'from-teal-400 to-cyan-500',
  3: 'from-blue-400 to-indigo-500',
  2: 'from-purple-400 to-violet-500',
  1: 'from-pink-500 to-rose-500',
}

interface KanjiCardProps {
  kanji: Kanji
  onClick: (kanji: Kanji) => void
  learned?: boolean
}

export default function KanjiCard({ kanji, onClick, learned = false }: KanjiCardProps) {
  const color = LEVEL_COLORS[kanji.jlpt]

  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(kanji)}
      className={`relative flex flex-col items-center justify-center gap-1 p-4 rounded-2xl bg-white/5 border transition-colors cursor-pointer w-full aspect-square
        ${learned ? 'border-green-500/50 bg-green-900/10' : 'border-white/10 hover:border-indigo-500/50'}`}
    >
      {learned && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400" />
      )}
      <span className={`text-4xl font-bold bg-gradient-to-br ${color} bg-clip-text text-transparent`}>
        {kanji.character}
      </span>
      <span className="text-xs text-slate-400 truncate w-full text-center leading-tight">
        {kanji.meanings[0]}
      </span>
      <span className="text-xs text-slate-500">
        {kanji.readings_on[0] ?? kanji.readings_kun[0] ?? '—'}
      </span>
    </motion.button>
  )
}

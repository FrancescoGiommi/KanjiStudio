import rawData from './kanjiDataFull.json'

export interface Kanji {
  character: string
  meanings: string[]
  meanings_it?: string[]
  meanings_ja?: string[]
  readings_on: string[]
  readings_kun: string[]
  jlpt: 1 | 2 | 3 | 4 | 5
  stroke_count: number
  grade?: number
}

const kanjiData = rawData as Kanji[]

export default kanjiData

// Conteggi derivati dal dataset reale: unica fonte di verità per i totali,
// così i numeri mostrati non possono più disallinearsi dai kanji effettivi.
export const LEVEL_COUNTS: Record<1 | 2 | 3 | 4 | 5, number> = kanjiData.reduce(
  (acc, k) => {
    acc[k.jlpt] += 1
    return acc
  },
  { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>,
)

export const TOTAL_COUNT = kanjiData.length

export const getKanjiByLevel = (level: 1 | 2 | 3 | 4 | 5): Kanji[] =>
  kanjiData.filter((k) => k.jlpt === level)

export const searchKanji = (query: string, level?: 1 | 2 | 3 | 4 | 5): Kanji[] => {
  const q = query.toLowerCase()
  const pool = level ? getKanjiByLevel(level) : kanjiData
  return pool.filter(
    (k) =>
      k.character.includes(query) ||
      k.meanings.some((m) => m.toLowerCase().includes(q)) ||
      (k.meanings_it ?? []).some((m) => m.toLowerCase().includes(q)) ||
      (k.meanings_ja ?? []).some((m) => m.includes(query)) ||
      k.readings_on.some((r) => r.includes(query)) ||
      k.readings_kun.some((r) => r.includes(query))
  )
}
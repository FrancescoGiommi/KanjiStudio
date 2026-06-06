import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Play, RotateCcw, XCircle, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import kanjiData, { type Kanji } from '../data/kanjiData'
import { useAuth } from '../contexts/AuthContext'

type QuizLevel = 'all' | 1 | 2 | 3 | 4 | 5
type QuizMode = 'meaning' | 'kanji'
type QuizPhase = 'setup' | 'playing' | 'finished'

interface QuizQuestion {
  id: string
  kanji: Kanji
  prompt: string
  correctAnswer: string
  options: string[]
  display: string
}

interface QuizAnswer {
  questionId: string
  selected: string
  isCorrect: boolean
}

const LEVELS: { value: QuizLevel; label: string }[] = [
  { value: 'all', label: 'Tutti' },
  { value: 5, label: 'N5' },
  { value: 4, label: 'N4' },
  { value: 3, label: 'N3' },
  { value: 2, label: 'N2' },
  { value: 1, label: 'N1' },
]

const MODES: { value: QuizMode; label: string; description: string }[] = [
  {
    value: 'meaning',
    label: 'Kanji -> significato',
    description: 'Vedi il kanji e scegli il significato corretto.',
  },
  {
    value: 'kanji',
    label: 'Significato -> kanji',
    description: 'Vedi il significato e scegli il kanji corretto.',
  },
]

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

function getPrimaryMeaning(kanji: Kanji): string {
  return kanji.meanings_it?.[0] ?? kanji.meanings[0] ?? 'Significato non disponibile'
}

function getLevelLabel(level: QuizLevel): string {
  return LEVELS.find((item) => item.value === level)?.label ?? 'Tutti'
}

function getModeLabel(mode: QuizMode): string {
  return MODES.find((item) => item.value === mode)?.label ?? 'Quiz'
}

function createQuestions(level: QuizLevel, mode: QuizMode): QuizQuestion[] {
  const levelPool = level === 'all' ? kanjiData : kanjiData.filter((kanji) => kanji.jlpt === level)
  const selectedKanji = shuffle(levelPool).slice(0, 10)

  return selectedKanji.map((kanji, index) => {
    const meaning = getPrimaryMeaning(kanji)

    if (mode === 'kanji') {
      const distractors = shuffle(
        kanjiData
          .filter((candidate) => candidate.character !== kanji.character)
          .map((candidate) => candidate.character)
      ).slice(0, 3)

      return {
        id: `${kanji.character}-${mode}-${index}`,
        kanji,
        prompt: `Quale kanji significa "${meaning}"?`,
        correctAnswer: kanji.character,
        options: shuffle([kanji.character, ...distractors]),
        display: meaning,
      }
    }

    const distractors = shuffle(
      kanjiData
        .filter((candidate) => candidate.character !== kanji.character)
        .map(getPrimaryMeaning)
        .filter((candidateMeaning) => candidateMeaning !== meaning)
    ).slice(0, 3)

    return {
      id: `${kanji.character}-${mode}-${index}`,
      kanji,
      prompt: `Qual è il significato di ${kanji.character}?`,
      correctAnswer: meaning,
      options: shuffle([meaning, ...distractors]),
      display: kanji.character,
    }
  })
}

export default function QuizPage() {
  const navigate = useNavigate()
  const { recordStudyActivity } = useAuth()
  const [level, setLevel] = useState<QuizLevel>('all')
  const [mode, setMode] = useState<QuizMode>('meaning')
  const [phase, setPhase] = useState<QuizPhase>('setup')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const currentQuestion = questions[currentIndex]
  const score = useMemo(() => answers.filter((answer) => answer.isCorrect).length, [answers])
  const progress = questions.length > 0 ? Math.round((answers.length / questions.length) * 100) : 0

  const startQuiz = () => {
    setQuestions(createQuestions(level, mode))
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setPhase('playing')
  }

  const resetToSetup = () => {
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setPhase('setup')
  }

  const retrySameQuiz = () => {
    setQuestions(createQuestions(level, mode))
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setPhase('playing')
  }

  const handleSelectAnswer = (answer: string) => {
    if (!currentQuestion || selectedAnswer || phase !== 'playing') return

    setSelectedAnswer(answer)
    setAnswers((previous) => [
      ...previous,
      {
        questionId: currentQuestion.id,
        selected: answer,
        isCorrect: answer === currentQuestion.correctAnswer,
      },
    ])
  }

  const goToNextQuestion = () => {
    setSelectedAnswer(null)

    if (answers.length === questions.length) {
      setPhase('finished')
      void recordStudyActivity()
      return
    }

    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))
  }

  const selectedAnswerIsCorrect = selectedAnswer === currentQuestion?.correctAnswer

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

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-6">
          <div>
            <div className="flex items-center gap-2 text-orange-300 font-semibold text-sm mb-2">
              <Zap size={16} />
              Quiz veloce
            </div>
            <h1 className="text-3xl font-extrabold">10 domande random</h1>
            <p className="text-slate-400 mt-1">
              {phase === 'setup'
                ? 'Scegli modalità e livello prima di iniziare.'
                : `${getModeLabel(mode)} · ${getLevelLabel(level)}`}
            </p>
          </div>

          {phase !== 'setup' && (
            <button
              onClick={resetToSetup}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white text-sm font-bold transition-all"
            >
              Cambia modalità
            </button>
          )}
        </div>

        {phase === 'setup' && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="mb-7">
              <p className="text-sm font-semibold text-slate-300 mb-3">Modalità</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MODES.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setMode(option.value)}
                    className={`min-h-24 rounded-xl border p-4 text-left transition-all ${
                      mode === option.value
                        ? 'bg-orange-500/15 border-orange-400 text-white'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <p className="font-bold">{option.label}</p>
                    <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-300 mb-3">Livello</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {LEVELS.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setLevel(option.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      level === option.value
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-orange-950/30'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 font-bold hover:from-yellow-400 hover:to-orange-400 transition-all"
            >
              <Play size={18} />
              Avvia quiz
            </button>
          </motion.section>
        )}

        {phase === 'finished' && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-400">Risultato finale</p>
                <h2 className="text-4xl font-extrabold mt-1">
                  {score} <span className="text-xl text-slate-500">/ {questions.length}</span>
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={retrySameQuiz}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 font-bold hover:from-yellow-400 hover:to-orange-400 transition-all"
                >
                  <RotateCcw size={18} />
                  Riprova
                </button>
                <button
                  onClick={resetToSetup}
                  className="px-5 py-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white font-bold transition-all"
                >
                  Nuova modalità
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              {questions.map((question, index) => {
                const answer = answers.find((item) => item.questionId === question.id)
                return (
                  <div
                    key={question.id}
                    className="flex items-center gap-4 rounded-xl bg-white/[0.03] border border-white/[0.07] p-4"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm text-slate-400 shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-2xl font-bold">{question.kanji.character}</p>
                      <p className="text-sm text-slate-400 truncate">
                        Risposta: <span className="text-white">{answer?.selected}</span>
                      </p>
                      {!answer?.isCorrect && (
                        <p className="text-sm text-green-300 truncate">Corretta: {question.correctAnswer}</p>
                      )}
                    </div>
                    {answer?.isCorrect ? (
                      <CheckCircle2 className="text-green-400 shrink-0" size={22} />
                    ) : (
                      <XCircle className="text-red-400 shrink-0" size={22} />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.section>
        )}

        {phase === 'playing' && currentQuestion && (
          <motion.section
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-sm text-slate-400">
                  Domanda {currentIndex + 1} di {questions.length}
                </p>
                <p className="text-sm text-orange-300 font-semibold">N{currentQuestion.kanji.jlpt}</p>
              </div>
              <span className="text-sm text-slate-400">{progress}%</span>
            </div>

            <div className="h-2 rounded-full bg-white/10 mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-center mb-8">
              <div className={mode === 'meaning' ? 'text-8xl sm:text-9xl font-bold mb-4 select-none' : 'text-4xl sm:text-5xl font-extrabold mb-5'}>
                {currentQuestion.display}
              </div>
              <h2 className="text-2xl font-extrabold">{currentQuestion.prompt}</h2>
              <p className="text-sm text-slate-500 mt-2">
                On: {currentQuestion.kanji.readings_on[0] ?? '—'} · Kun: {currentQuestion.kanji.readings_kun[0] ?? '—'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option
                const isCorrect = option === currentQuestion.correctAnswer
                const showCorrect = selectedAnswer && isCorrect
                const showWrong = isSelected && !isCorrect

                return (
                  <button
                    key={option}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={Boolean(selectedAnswer)}
                    className={`min-h-16 px-4 py-3 rounded-xl border text-left font-semibold transition-all ${
                      mode === 'kanji' ? 'text-3xl text-center' : ''
                    } ${
                      showCorrect
                        ? 'bg-green-500/20 border-green-400 text-green-200'
                        : showWrong
                          ? 'bg-red-500/20 border-red-400 text-red-200'
                          : 'bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/10 hover:border-orange-400/60'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {selectedAnswer && (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className={`font-semibold ${selectedAnswerIsCorrect ? 'text-green-300' : 'text-red-300'}`}>
                  {selectedAnswerIsCorrect ? 'Risposta corretta!' : `Risposta corretta: ${currentQuestion.correctAnswer}`}
                </p>
                <button
                  onClick={goToNextQuestion}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-colors"
                >
                  {answers.length === questions.length ? 'Vedi risultato' : 'Prossima domanda'}
                </button>
              </div>
            )}
          </motion.section>
        )}
      </main>
    </div>
  )
}

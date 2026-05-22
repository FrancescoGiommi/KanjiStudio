import { readFileSync, writeFileSync } from 'fs'

const INPUT = 'src/data/kanjiDataFull.json'
const data = JSON.parse(readFileSync(INPUT, 'utf-8'))

// ── 1. Collect unique meanings ──────────────────────────────────────────────
const uniqueMeanings = [...new Set(data.flatMap((k) => k.meanings))]
console.log(`Meanings unici da tradurre: ${uniqueMeanings.length}`)

// ── 2. Translate via Google Translate unofficial endpoint ────────────────────
async function translateWord(word) {
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=en&tl=it&dt=t&q=${encodeURIComponent(word)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for "${word}"`)
  const json = await res.json()
  // Result structure: [ [ [translatedText, ...], ... ], ... ]
  return json[0]
    .map((seg) => seg[0])
    .join('')
    .trim()
    .toLowerCase()
}

const translationMap = {}
let errors = 0

for (let i = 0; i < uniqueMeanings.length; i++) {
  const meaning = uniqueMeanings[i]
  try {
    translationMap[meaning] = await translateWord(meaning)
  } catch (e) {
    console.error(`  ✗ Errore su "${meaning}": ${e.message}`)
    translationMap[meaning] = meaning // fallback: keep English
    errors++
  }
  if ((i + 1) % 50 === 0) {
    console.log(`  ✓ ${i + 1}/${uniqueMeanings.length} meanings tradotti`)
  }
  await new Promise((r) => setTimeout(r, 80)) // 80ms delay
}

// ── 3. Apply translations to each kanji ────────────────────────────────────
for (const kanji of data) {
  kanji.meanings_it = kanji.meanings.map((m) => translationMap[m] ?? m)
}

// ── 4. Save ─────────────────────────────────────────────────────────────────
writeFileSync(INPUT, JSON.stringify(data, null, 2), 'utf-8')

console.log(`\n✅ Completato!`)
console.log(`   Meanings tradotti : ${uniqueMeanings.length - errors}`)
console.log(`   Errori            : ${errors}`)
console.log(`   File              : ${INPUT}`)

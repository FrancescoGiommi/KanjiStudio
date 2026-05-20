export interface Kanji {
  character: string
  meanings: string[]
  meanings_it: string[]
  meanings_ja: string[]
  readings_on: string[]
  readings_kun: string[]
  jlpt: 1 | 2 | 3 | 4 | 5
  stroke_count: number
  grade?: number
}

const kanjiData: Kanji[] = [
  // N5
  { character: '日', meanings: ['day', 'sun', 'Japan'], meanings_it: ['giorno', 'sole', 'Giappone'], meanings_ja: ['ひ', 'にっぽん'], readings_on: ['ニチ', 'ジツ'], readings_kun: ['ひ', 'か'], jlpt: 5, stroke_count: 4, grade: 1 },
  { character: '月', meanings: ['month', 'moon'], meanings_it: ['mese', 'luna'], meanings_ja: ['つき', 'げつ'], readings_on: ['ゲツ', 'ガツ'], readings_kun: ['つき'], jlpt: 5, stroke_count: 4, grade: 1 },
  { character: '火', meanings: ['fire'], meanings_it: ['fuoco'], meanings_ja: ['ひ', 'ほのお'], readings_on: ['カ'], readings_kun: ['ひ', 'ほ'], jlpt: 5, stroke_count: 4, grade: 1 },
  { character: '水', meanings: ['water'], meanings_it: ['acqua'], meanings_ja: ['みず'], readings_on: ['スイ'], readings_kun: ['みず'], jlpt: 5, stroke_count: 4, grade: 1 },
  { character: '木', meanings: ['tree', 'wood'], meanings_it: ['albero', 'legno'], meanings_ja: ['き', 'もくざい'], readings_on: ['モク', 'ボク'], readings_kun: ['き', 'こ'], jlpt: 5, stroke_count: 4, grade: 1 },
  { character: '金', meanings: ['gold', 'money', 'Friday'], meanings_it: ['oro', 'denaro', 'venerdì'], meanings_ja: ['かね', 'きん'], readings_on: ['キン', 'コン'], readings_kun: ['かね', 'かな'], jlpt: 5, stroke_count: 8, grade: 1 },
  { character: '土', meanings: ['soil', 'earth', 'Saturday'], meanings_it: ['terra', 'suolo', 'sabato'], meanings_ja: ['つち', 'どよう'], readings_on: ['ド', 'ト'], readings_kun: ['つち'], jlpt: 5, stroke_count: 3, grade: 1 },
  { character: '山', meanings: ['mountain'], meanings_it: ['montagna'], meanings_ja: ['やま'], readings_on: ['サン', 'セン'], readings_kun: ['やま'], jlpt: 5, stroke_count: 3, grade: 1 },
  { character: '川', meanings: ['river'], meanings_it: ['fiume'], meanings_ja: ['かわ'], readings_on: ['セン'], readings_kun: ['かわ'], jlpt: 5, stroke_count: 3, grade: 1 },
  { character: '人', meanings: ['person'], meanings_it: ['persona'], meanings_ja: ['ひと', 'じんぶつ'], readings_on: ['ジン', 'ニン'], readings_kun: ['ひと'], jlpt: 5, stroke_count: 2, grade: 1 },
  { character: '口', meanings: ['mouth'], meanings_it: ['bocca'], meanings_ja: ['くち'], readings_on: ['コウ', 'ク'], readings_kun: ['くち'], jlpt: 5, stroke_count: 3, grade: 1 },
  { character: '手', meanings: ['hand'], meanings_it: ['mano'], meanings_ja: ['て'], readings_on: ['シュ'], readings_kun: ['て', 'た'], jlpt: 5, stroke_count: 4, grade: 1 },
  { character: '目', meanings: ['eye'], meanings_it: ['occhio'], meanings_ja: ['め'], readings_on: ['モク', 'ボク'], readings_kun: ['め', 'ま'], jlpt: 5, stroke_count: 5, grade: 1 },
  { character: '耳', meanings: ['ear'], meanings_it: ['orecchio'], meanings_ja: ['みみ'], readings_on: ['ジ'], readings_kun: ['みみ'], jlpt: 5, stroke_count: 6, grade: 1 },
  { character: '足', meanings: ['foot', 'leg', 'to be enough'], meanings_it: ['piede', 'gamba', 'sufficiente'], meanings_ja: ['あし', 'たりる'], readings_on: ['ソク'], readings_kun: ['あし', 'た.りる'], jlpt: 5, stroke_count: 7, grade: 1 },
  { character: '大', meanings: ['large', 'big'], meanings_it: ['grande'], meanings_ja: ['おおきい', 'だいきい'], readings_on: ['ダイ', 'タイ'], readings_kun: ['おお', 'おお.きい'], jlpt: 5, stroke_count: 3, grade: 1 },
  { character: '小', meanings: ['small', 'little'], meanings_it: ['piccolo'], meanings_ja: ['ちいさい', 'こさい'], readings_on: ['ショウ'], readings_kun: ['こ', 'ちい.さい'], jlpt: 5, stroke_count: 3, grade: 1 },
  { character: '中', meanings: ['middle', 'inside', 'China'], meanings_it: ['centro', 'interno', 'Cina'], meanings_ja: ['なか', 'ちゅうごく'], readings_on: ['チュウ'], readings_kun: ['なか'], jlpt: 5, stroke_count: 4, grade: 1 },
  { character: '上', meanings: ['above', 'up', 'on'], meanings_it: ['sopra', 'su'], meanings_ja: ['うえ', 'あがる'], readings_on: ['ジョウ', 'ショウ'], readings_kun: ['うえ', 'あ.げる'], jlpt: 5, stroke_count: 3, grade: 1 },
  { character: '下', meanings: ['below', 'down', 'under'], meanings_it: ['sotto', 'giù'], meanings_ja: ['した', 'さがる'], readings_on: ['カ', 'ゲ'], readings_kun: ['した', 'さ.げる'], jlpt: 5, stroke_count: 3, grade: 1 },
  { character: '国', meanings: ['country'], meanings_it: ['paese', 'nazione'], meanings_ja: ['くに', 'こっか'], readings_on: ['コク'], readings_kun: ['くに'], jlpt: 5, stroke_count: 8, grade: 2 },
  { character: '年', meanings: ['year'], meanings_it: ['anno'], meanings_ja: ['とし', 'ねん'], readings_on: ['ネン'], readings_kun: ['とし'], jlpt: 5, stroke_count: 6, grade: 1 },

  // N4
  { character: '駅', meanings: ['station'], meanings_it: ['stazione'], meanings_ja: ['えき', 'でんしゃのえき'], readings_on: ['エキ'], readings_kun: [], jlpt: 4, stroke_count: 14, grade: 3 },
  { character: '海', meanings: ['sea', 'ocean'], meanings_it: ['mare', 'oceano'], meanings_ja: ['うみ', 'かいよう'], readings_on: ['カイ'], readings_kun: ['うみ'], jlpt: 4, stroke_count: 9, grade: 2 },
  { character: '泳', meanings: ['swim'], meanings_it: ['nuotare'], meanings_ja: ['およぐ', 'すいえい'], readings_on: ['エイ'], readings_kun: ['およ.ぐ'], jlpt: 4, stroke_count: 8, grade: 3 },
  { character: '映', meanings: ['reflect', 'project', 'movie'], meanings_it: ['riflettere', 'proiettare', 'film'], meanings_ja: ['うつす', 'えいが'], readings_on: ['エイ'], readings_kun: ['うつ.す', 'は.える'], jlpt: 4, stroke_count: 9, grade: 6 },
  { character: '意', meanings: ['idea', 'meaning', 'mind'], meanings_it: ['idea', 'significato', 'mente'], meanings_ja: ['いみ', 'きもち'], readings_on: ['イ'], readings_kun: [], jlpt: 4, stroke_count: 13, grade: 3 },
  { character: '医', meanings: ['doctor', 'medicine'], meanings_it: ['medico', 'medicina'], meanings_ja: ['いしゃ', 'いりょう'], readings_on: ['イ'], readings_kun: [], jlpt: 4, stroke_count: 7, grade: 3 },
  { character: '飲', meanings: ['drink'], meanings_it: ['bere'], meanings_ja: ['のむ', 'いんりょう'], readings_on: ['イン'], readings_kun: ['の.む'], jlpt: 4, stroke_count: 12, grade: 3 },
  { character: '院', meanings: ['institution', 'temple'], meanings_it: ['istituzione', 'tempio'], meanings_ja: ['いん', 'びょういん'], readings_on: ['イン'], readings_kun: [], jlpt: 4, stroke_count: 10, grade: 3 },
  { character: '運', meanings: ['carry', 'luck', 'fate'], meanings_it: ['portare', 'fortuna', 'destino'], meanings_ja: ['はこぶ', 'うんどう'], readings_on: ['ウン'], readings_kun: ['はこ.ぶ'], jlpt: 4, stroke_count: 12, grade: 3 },
  { character: '英', meanings: ['England', 'brilliant', 'hero'], meanings_it: ['Inghilterra', 'brillante', 'eroe'], meanings_ja: ['えいご', 'えいゆう'], readings_on: ['エイ'], readings_kun: [], jlpt: 4, stroke_count: 8, grade: 4 },
  { character: '遠', meanings: ['far', 'distant'], meanings_it: ['lontano', 'distante'], meanings_ja: ['とおい', 'えんかく'], readings_on: ['エン', 'オン'], readings_kun: ['とお.い'], jlpt: 4, stroke_count: 13, grade: 2 },
  { character: '音', meanings: ['sound', 'noise'], meanings_it: ['suono', 'rumore'], meanings_ja: ['おと', 'ね'], readings_on: ['オン', 'イン'], readings_kun: ['おと', 'ね'], jlpt: 4, stroke_count: 9, grade: 1 },
  { character: '家', meanings: ['house', 'home', 'family'], meanings_it: ['casa', 'famiglia'], meanings_ja: ['いえ', 'かぞく'], readings_on: ['カ', 'ケ'], readings_kun: ['いえ', 'や'], jlpt: 4, stroke_count: 10, grade: 2 },
  { character: '歌', meanings: ['song', 'sing'], meanings_it: ['canzone', 'cantare'], meanings_ja: ['うた', 'うたう'], readings_on: ['カ'], readings_kun: ['うた', 'うた.う'], jlpt: 4, stroke_count: 14, grade: 2 },
  { character: '画', meanings: ['picture', 'drawing', 'stroke'], meanings_it: ['immagine', 'disegno'], meanings_ja: ['え', 'えいが'], readings_on: ['ガ', 'カク'], readings_kun: ['えが.く'], jlpt: 4, stroke_count: 8, grade: 2 },
  { character: '会', meanings: ['meet', 'association', 'society'], meanings_it: ['incontro', 'associazione', 'società'], meanings_ja: ['あう', 'かいしゃ'], readings_on: ['カイ', 'エ'], readings_kun: ['あ.う'], jlpt: 4, stroke_count: 6, grade: 2 },
  { character: '回', meanings: ['turn', 'times', 'round'], meanings_it: ['girare', 'volte', 'giro'], meanings_ja: ['まわる', 'かいすう'], readings_on: ['カイ', 'エ'], readings_kun: ['まわ.る'], jlpt: 4, stroke_count: 6, grade: 2 },
  { character: '開', meanings: ['open'], meanings_it: ['aprire'], meanings_ja: ['ひらく', 'あく'], readings_on: ['カイ'], readings_kun: ['ひら.く', 'あ.く'], jlpt: 4, stroke_count: 12, grade: 3 },

  // N3
  { character: '愛', meanings: ['love', 'affection'], meanings_it: ['amore', 'affetto'], meanings_ja: ['あい', 'いとしい'], readings_on: ['アイ'], readings_kun: ['いと.しい', 'かな.しい'], jlpt: 3, stroke_count: 13, grade: 4 },
  { character: '悪', meanings: ['bad', 'evil', 'wrong'], meanings_it: ['cattivo', 'malvagio', 'sbagliato'], meanings_ja: ['わるい', 'あく'], readings_on: ['アク', 'オ'], readings_kun: ['わる.い'], jlpt: 3, stroke_count: 11, grade: 3 },
  { character: '安', meanings: ['peace', 'cheap', 'relax'], meanings_it: ['pace', 'economico', 'rilassarsi'], meanings_ja: ['やすい', 'あんしん'], readings_on: ['アン'], readings_kun: ['やす.い'], jlpt: 3, stroke_count: 6, grade: 3 },
  { character: '暗', meanings: ['dark', 'gloomy'], meanings_it: ['buio', 'cupo'], meanings_ja: ['くらい', 'あんやく'], readings_on: ['アン'], readings_kun: ['くら.い'], jlpt: 3, stroke_count: 13, grade: 3 },
  { character: '以', meanings: ['by means of', 'because', 'compared with'], meanings_it: ['mediante', 'perché', 'rispetto a'], meanings_ja: ['いじょう', 'いか'], readings_on: ['イ'], readings_kun: [], jlpt: 3, stroke_count: 5, grade: 4 },
  { character: '位', meanings: ['rank', 'grade', 'throne'], meanings_it: ['rango', 'grado', 'trono'], meanings_ja: ['くらい', 'いち'], readings_on: ['イ'], readings_kun: ['くらい'], jlpt: 3, stroke_count: 7, grade: 4 },
  { character: '囲', meanings: ['surround', 'enclosure'], meanings_it: ['circondare', 'recinzione'], meanings_ja: ['かこむ', 'かこい'], readings_on: ['イ'], readings_kun: ['かこ.む', 'かこ.い'], jlpt: 3, stroke_count: 7, grade: 4 },
  { character: '委', meanings: ['committee', 'entrust', 'leave'], meanings_it: ['comitato', 'delegare'], meanings_ja: ['いいん', 'ゆだねる'], readings_on: ['イ'], readings_kun: ['ゆだ.ねる'], jlpt: 3, stroke_count: 8, grade: 3 },
  { character: '移', meanings: ['shift', 'move', 'change'], meanings_it: ['spostare', 'muovere', 'cambiare'], meanings_ja: ['うつる', 'いどう'], readings_on: ['イ'], readings_kun: ['うつ.る', 'うつ.す'], jlpt: 3, stroke_count: 11, grade: 5 },
  { character: '印', meanings: ['stamp', 'seal', 'India'], meanings_it: ['timbro', 'sigillo', 'India'], meanings_ja: ['しるし', 'いんかん'], readings_on: ['イン'], readings_kun: ['しるし'], jlpt: 3, stroke_count: 6, grade: 4 },
  { character: '員', meanings: ['employee', 'member', 'number'], meanings_it: ['impiegato', 'membro', 'numero'], meanings_ja: ['いん', 'しゃいん'], readings_on: ['イン'], readings_kun: [], jlpt: 3, stroke_count: 10, grade: 3 },
  { character: '因', meanings: ['cause', 'reason'], meanings_it: ['causa', 'ragione'], meanings_ja: ['げんいん', 'よる'], readings_on: ['イン'], readings_kun: ['よ.る'], jlpt: 3, stroke_count: 6, grade: 5 },
  { character: '引', meanings: ['pull', 'tug', 'attract'], meanings_it: ['tirare', 'attirare'], meanings_ja: ['ひく', 'ひっぱる'], readings_on: ['イン'], readings_kun: ['ひ.く', 'ひ.ける'], jlpt: 3, stroke_count: 4, grade: 2 },
  { character: '宇', meanings: ['eaves', 'roof', 'universe'], meanings_it: ['gronda', 'tetto', 'universo'], meanings_ja: ['うちゅう', 'のき'], readings_on: ['ウ'], readings_kun: [], jlpt: 3, stroke_count: 6, grade: 6 },

  // N2
  { character: '握', meanings: ['grip', 'hold', 'clench'], meanings_it: ['afferrare', 'stringere'], meanings_ja: ['にぎる', 'あくしゅ'], readings_on: ['アク'], readings_kun: ['にぎ.る'], jlpt: 2, stroke_count: 12 },
  { character: '扱', meanings: ['handle', 'deal with', 'treat'], meanings_it: ['maneggiare', 'trattare'], meanings_ja: ['あつかう', 'とりあつかい'], readings_on: [], readings_kun: ['あつか.う', 'あつか.い'], jlpt: 2, stroke_count: 6 },
  { character: '依', meanings: ['rely on', 'depend', 'be due to'], meanings_it: ['dipendere', 'affidarsi'], meanings_ja: ['よる', 'いらい'], readings_on: ['イ', 'エ'], readings_kun: ['よ.る'], jlpt: 2, stroke_count: 8 },
  { character: '威', meanings: ['intimidate', 'dignity', 'power'], meanings_it: ['intimidire', 'dignità', 'potere'], meanings_ja: ['おどす', 'いげん'], readings_on: ['イ'], readings_kun: ['おど.す'], jlpt: 2, stroke_count: 9 },
  { character: '為', meanings: ['do', 'act', 'cause'], meanings_it: ['fare', 'agire', 'causa'], meanings_ja: ['ため', 'なす'], readings_on: ['イ'], readings_kun: ['ため', 'な.る', 'な.す'], jlpt: 2, stroke_count: 9 },
  { character: '維', meanings: ['fiber', 'tie', 'preserve'], meanings_it: ['fibra', 'legare', 'preservare'], meanings_ja: ['いじする', 'せんい'], readings_on: ['イ'], readings_kun: [], jlpt: 2, stroke_count: 14 },
  { character: '緯', meanings: ['weft', 'left and right', 'latitude'], meanings_it: ['trama', 'latitudine'], meanings_ja: ['いど', 'よこいと'], readings_on: ['イ'], readings_kun: [], jlpt: 2, stroke_count: 16 },
  { character: '域', meanings: ['range', 'region', 'area'], meanings_it: ['area', 'regione', 'zona'], meanings_ja: ['いき', 'ちいき'], readings_on: ['イキ'], readings_kun: [], jlpt: 2, stroke_count: 11 },
  { character: '逸', meanings: ['deviate', 'escape', 'excel'], meanings_it: ['deviare', 'sfuggire', 'eccellere'], meanings_ja: ['はぐれる', 'いつわ'], readings_on: ['イツ'], readings_kun: ['そ.れる', 'はぐ.れる'], jlpt: 2, stroke_count: 11 },
  { character: '稲', meanings: ['rice plant'], meanings_it: ['pianta di riso'], meanings_ja: ['いね', 'いなほ'], readings_on: ['トウ', 'デン'], readings_kun: ['いね', 'いな'], jlpt: 2, stroke_count: 14 },
  { character: '陰', meanings: ['shade', 'shadow', 'negative'], meanings_it: ['ombra', 'negativo'], meanings_ja: ['かげ', 'いんき'], readings_on: ['イン', 'オン'], readings_kun: ['かげ', 'かげ.る'], jlpt: 2, stroke_count: 11 },
  { character: '隠', meanings: ['conceal', 'hide'], meanings_it: ['nascondere', 'celare'], meanings_ja: ['かくす', 'かくれる'], readings_on: ['イン', 'オン'], readings_kun: ['かく.す', 'かく.れる'], jlpt: 2, stroke_count: 14 },

  // N1
  { character: '哀', meanings: ['pathetic', 'grief', 'sorrow'], meanings_it: ['patetico', 'dolore', 'tristezza'], meanings_ja: ['あわれ', 'かなしみ'], readings_on: ['アイ'], readings_kun: ['あわ.れ', 'あわ.れむ'], jlpt: 1, stroke_count: 9 },
  { character: '挨', meanings: ['push open', 'greet'], meanings_it: ['salutare', 'aprire spingendo'], meanings_ja: ['あいさつ'], readings_on: ['アイ'], readings_kun: [], jlpt: 1, stroke_count: 10 },
  { character: '曖', meanings: ['obscure', 'vague', 'ambiguous'], meanings_it: ['oscuro', 'vago', 'ambiguo'], meanings_ja: ['あいまい', 'はっきりしない'], readings_on: ['アイ'], readings_kun: ['あい.まい'], jlpt: 1, stroke_count: 17 },
  { character: '葵', meanings: ['hollyhock'], meanings_it: ['malva'], meanings_ja: ['あおい'], readings_on: ['キ'], readings_kun: ['あおい'], jlpt: 1, stroke_count: 12 },
  { character: '亜', meanings: ['Asia', 'rank next', 'substandard'], meanings_it: ['Asia', 'secondo', 'inferiore'], meanings_ja: ['アジア', 'つぐ'], readings_on: ['ア'], readings_kun: ['つ.ぐ'], jlpt: 1, stroke_count: 7 },
  { character: '渥', meanings: ['kindness', 'moisten'], meanings_it: ['gentilezza', 'umidire'], meanings_ja: ['あつい', 'めぐみ'], readings_on: ['アク'], readings_kun: ['あつ.い'], jlpt: 1, stroke_count: 12 },
  { character: '斡', meanings: ['go-between', 'mediate'], meanings_it: ['intermediario', 'mediare'], meanings_ja: ['あっせん'], readings_on: ['アツ', 'カン'], readings_kun: [], jlpt: 1, stroke_count: 14 },
  { character: '宛', meanings: ['address', 'just like', 'informal'], meanings_it: ['indirizzo', 'proprio come'], meanings_ja: ['あてる', 'あたかも'], readings_on: ['エン'], readings_kun: ['あ.てる', 'あたか.も'], jlpt: 1, stroke_count: 8 },
]

export default kanjiData

export const getKanjiByLevel = (level: 1 | 2 | 3 | 4 | 5): Kanji[] =>
  kanjiData.filter((k) => k.jlpt === level)

export const searchKanji = (query: string, level?: 1 | 2 | 3 | 4 | 5): Kanji[] => {
  const q = query.toLowerCase()
  const pool = level ? getKanjiByLevel(level) : kanjiData
  return pool.filter(
    (k) =>
      k.character.includes(query) ||
      k.meanings.some((m) => m.toLowerCase().includes(q)) ||
      k.meanings_it.some((m) => m.toLowerCase().includes(q)) ||
      k.meanings_ja.some((m) => m.includes(query)) ||
      k.readings_on.some((r) => r.includes(query)) ||
      k.readings_kun.some((r) => r.includes(query))
  )
}

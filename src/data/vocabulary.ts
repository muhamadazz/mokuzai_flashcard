export interface VocabularyWord {
  halaman: number;
  kanji: string;
  hiragana: string;
  arti: string;
}

// Sample vocabulary data - replace with your Excel data
// To use your Excel file, place it in public/ folder and use the xlsx library to parse it
export const vocabularyData: VocabularyWord[] = [
  // Halaman 1
  { halaman: 1, kanji: "私", hiragana: "わたし", arti: "saya" },
  { halaman: 1, kanji: "貴方", hiragana: "あなた", arti: "Anda" },
  { halaman: 1, kanji: "人", hiragana: "ひと", arti: "orang" },
  { halaman: 1, kanji: "日本", hiragana: "にほん", arti: "Jepang" },
  { halaman: 1, kanji: "語", hiragana: "ご", arti: "bahasa" },
  { halaman: 1, kanji: "学生", hiragana: "がくせい", arti: "pelajar/mahasiswa" },
  { halaman: 1, kanji: "先生", hiragana: "せんせい", arti: "guru" },
  { halaman: 1, kanji: "学校", hiragana: "がっこう", arti: "sekolah" },

  // Halaman 2
  { halaman: 2, kanji: "時間", hiragana: "じかん", arti: "waktu" },
  { halaman: 2, kanji: "今日", hiragana: "きょう", arti: "hari ini" },
  { halaman: 2, kanji: "明日", hiragana: "あした", arti: "besok" },
  { halaman: 2, kanji: "昨日", hiragana: "きのう", arti: "kemarin" },
  { halaman: 2, kanji: "朝", hiragana: "あさ", arti: "pagi" },
  { halaman: 2, kanji: "昼", hiragana: "ひる", arti: "siang" },
  { halaman: 2, kanji: "夜", hiragana: "よる", arti: "malam" },
  { halaman: 2, kanji: "毎日", hiragana: "まいにち", arti: "setiap hari" },

  // Halaman 3
  { halaman: 3, kanji: "水", hiragana: "みず", arti: "air" },
  { halaman: 3, kanji: "火", hiragana: "ひ", arti: "api" },
  { halaman: 3, kanji: "山", hiragana: "やま", arti: "gunung" },
  { halaman: 3, kanji: "川", hiragana: "かわ", arti: "sungai" },
  { halaman: 3, kanji: "海", hiragana: "うみ", arti: "laut" },
  { halaman: 3, kanji: "空", hiragana: "そら", arti: "langit" },
  { halaman: 3, kanji: "風", hiragana: "かぜ", arti: "angin" },
  { halaman: 3, kanji: "雨", hiragana: "あめ", arti: "hujan" },

  // Halaman 4
  { halaman: 4, kanji: "食", hiragana: "たべもの", arti: "makanan" },
  { halaman: 4, kanji: "飲", hiragana: "のみもの", arti: "minuman" },
  { halaman: 4, kanji: "飯", hiragana: "ごはん", arti: "nasi/makanan" },
  { halaman: 4, kanji: "肉", hiragana: "にく", arti: "daging" },
  { halaman: 4, kanji: "魚", hiragana: "さかな", arti: "ikan" },
  { halaman: 4, kanji: "野菜", hiragana: "やさい", arti: "sayuran" },
  { halaman: 4, kanji: "果物", hiragana: "くだもの", arti: "buah-buahan" },
  { halaman: 4, kanji: "牛乳", hiragana: "ぎゅうにゅう", arti: "susu" },

  // Halaman 5
  { halaman: 5, kanji: "家", hiragana: "いえ", arti: "rumah" },
  { halaman: 5, kanji: "部屋", hiragana: "へや", arti: "kamar" },
  { halaman: 5, kanji: "門", hiragana: "もん", arti: "pintu gerbang" },
  { halaman: 5, kanji: "窓", hiragana: "まど", arti: "jendela" },
  { halaman: 5, kanji: "机", hiragana: "つくえ", arti: "meja" },
  { halaman: 5, kanji: "椅子", hiragana: "いす", arti: "kursi" },
  { halaman: 5, kanji: "本", hiragana: "ほん", arti: "buku" },
  { halaman: 5, kanji: "電気", hiragana: "でんき", arti: "lampu/listrik" },
];

export function getPages(): number[] {
  const pages = [...new Set(vocabularyData.map(v => v.halaman))];
  return pages.sort((a, b) => a - b);
}

export function getVocabularyByPage(page: number): VocabularyWord[] {
  return vocabularyData.filter(v => v.halaman === page);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

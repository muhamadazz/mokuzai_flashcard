import * as XLSX from "xlsx";
import type { VocabularyWord } from "../data/vocabulary";

export async function loadExcelFromUrl(url: string): Promise<VocabularyWord[]> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][];

    // Skip header row if exists, parse data
    const vocabulary: VocabularyWord[] = [];
    const startRow = data[0] && typeof data[0][0] === "string" &&
      (data[0][0].toLowerCase().includes("halaman") || data[0][0].toLowerCase().includes("page"))
      ? 1
      : 0;

    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      if (row && row.length >= 4) {
        const halaman = Number(row[0]) || 0;
        const kanji = String(row[1] || "");
        const hiragana = String(row[2] || "");
        const arti = String(row[3] || "");

        if (kanji || hiragana || arti) {
          vocabulary.push({ halaman, kanji, hiragana, arti });
        }
      }
    }

    return vocabulary;
  } catch (error) {
    console.error("Error loading Excel:", error);
    return [];
  }
}

export async function loadExcelFromFile(file: File): Promise<VocabularyWord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result;
        if (!arrayBuffer) {
          reject(new Error("Failed to read file"));
          return;
        }

        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][];

        const vocabulary: VocabularyWord[] = [];
        const startRow = data[0] && typeof data[0][0] === "string" &&
          (data[0][0].toLowerCase().includes("halaman") || data[0][0].toLowerCase().includes("page"))
          ? 1
          : 0;

        for (let i = startRow; i < data.length; i++) {
          const row = data[i];
          if (row && row.length >= 4) {
            const halaman = Number(row[0]) || 0;
            const kanji = String(row[1] || "");
            const hiragana = String(row[2] || "");
            const arti = String(row[3] || "");

            if (kanji || hiragana || arti) {
              vocabulary.push({ halaman, kanji, hiragana, arti });
            }
          }
        }

        resolve(vocabulary);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

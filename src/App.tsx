import { useState, useEffect, useCallback } from "react";
import { BookOpen, Brain, Layers, Upload } from "lucide-react";
import { Flashcard } from "./components/Flashcard";
import { Quiz } from "./components/Quiz";
import { FileUpload } from "./components/FileUpload";
import { getPages, vocabularyData as defaultVocabularyData, shuffleArray } from "./data/vocabulary";
import { loadExcelFromUrl } from "./utils/excelLoader";
import type { VocabularyWord } from "./data/vocabulary";

type Mode = "home" | "flashcard" | "quiz";

export function getPagesFromData(data: VocabularyWord[]): number[] {
  const pages = [...new Set(data.map(v => v.halaman))];
  return pages.sort((a, b) => a - b);
}

function App() {
  const [mode, setMode] = useState<Mode>("home");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [vocabularyData, setVocabularyData] = useState<VocabularyWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      // First try to load from public folder
      const excelData = await loadExcelFromUrl("/kotoba_mokuzai.xlsx");
      if (excelData.length > 0) {
        setVocabularyData(excelData);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleDataLoaded = useCallback((data: VocabularyWord[]) => {
    setVocabularyData(data);
    setSelectedPages([]);
  }, []);

  const pages = getPagesFromData(vocabularyData.length > 0 ? vocabularyData : defaultVocabularyData);
  const activeData = vocabularyData.length > 0 ? vocabularyData : defaultVocabularyData;

  const allWords = selectedPages.length === 0
    ? activeData
    : shuffleArray(selectedPages.flatMap(p => activeData.filter(word => word.halaman === p)));

  const togglePage = (page: number) => {
    setSelectedPages(prev =>
      prev.includes(page)
        ? prev.filter(p => p !== page)
        : [...prev, page].sort((a, b) => a - b)
    );
  };

  const selectAllPages = () => {
    if (selectedPages.length === pages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages([...pages]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (mode === "flashcard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={() => setMode("home")}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>&larr;</span>
            <span>Kembali</span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Flashcard</h1>
            <p className="text-gray-500">
              {selectedPages.length === 0
                ? "Semua halaman"
                : `Halaman: ${selectedPages.join(", ")}`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {allWords.length} kosakata
            </p>
          </div>

          <Flashcard words={allWords} />
        </div>
      </div>
    );
  }

  if (mode === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={() => setMode("home")}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>&larr;</span>
            <span>Kembali</span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz</h1>
            <p className="text-gray-500">
              {selectedPages.length === 0
                ? "Semua halaman"
                : `Halaman: ${selectedPages.join(", ")}`}
            </p>
          </div>

          <Quiz words={allWords} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 mb-4 shadow-lg">
            <span className="text-3xl">言葉</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Kotoba Mokuzai</h1>
          <p className="text-gray-500">Belajar kosakata Bahasa Jepang</p>
        </div>

        {/* File Upload */}
        {/* <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-700">Data Source</h2>
          </div>
          <FileUpload
            onDataLoaded={handleDataLoaded}
            currentData={vocabularyData}
          />
        </div> */}

        {/* Page Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Pilih Halaman</h2>
            <button
              onClick={selectAllPages}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {selectedPages.length === pages.length ? "Hapus semua" : "Pilih semua"}
            </button>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {pages.map(page => (
              <button
                key={page}
                onClick={() => togglePage(page)}
                className={`h-12 rounded-lg font-medium transition-all ${
                  selectedPages.includes(page)
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {selectedPages.length > 0 && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              {allWords.length} kosakata dipilih
            </p>
          )}
        </div>

        {/* Mode Selection */}
        <div className="space-y-4">
          <button
            onClick={() => setMode("flashcard")}
            disabled={allWords.length === 0}
            className={`w-full p-6 rounded-2xl flex items-center gap-4 transition-all ${
              allWords.length > 0
                ? "bg-white shadow-md hover:shadow-lg hover:scale-[1.02] border border-gray-100"
                : "bg-gray-100 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-gray-800">Flashcard</h3>
              <p className="text-gray-500 text-sm">Latihan dengan kartu kilat</p>
            </div>
            <span className="text-2xl text-gray-300">&rarr;</span>
          </button>

          <button
            onClick={() => setMode("quiz")}
            disabled={allWords.length === 0}
            className={`w-full p-6 rounded-2xl flex items-center gap-4 transition-all ${
              allWords.length > 0
                ? "bg-white shadow-md hover:shadow-lg hover:scale-[1.02] border border-gray-100"
                : "bg-gray-100 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-gray-800">Quiz</h3>
              <p className="text-gray-500 text-sm">Uji pemahaman Anda</p>
            </div>
            <span className="text-2xl text-gray-300">&rarr;</span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-700">Statistik</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-800">{activeData.length}</p>
              <p className="text-sm text-gray-500">Total Kosakata</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{pages.length}</p>
              <p className="text-sm text-gray-500">Halaman</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {pages.length > 0 ? Math.round(activeData.length / pages.length) : 0}
              </p>
              <p className="text-sm text-gray-500">Per Halaman</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Upload file Excel Anda dengan format: Halaman, Kanji, Hiragana, Arti</p>
        </div>
      </div>
    </div>
  );
}

export default App;

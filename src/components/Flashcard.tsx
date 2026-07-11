import { useState } from "react";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import type { VocabularyWord } from "../data/vocabulary";

interface FlashcardProps {
  words: VocabularyWord[];
}

type DisplayMode = "kanji" | "hiragana" | "arti";

export function Flashcard({ words: initialWords }: FlashcardProps) {
  const [words] = useState(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("kanji");

  const currentWord = words[currentIndex];

  const getFrontContent = () => {
    switch (displayMode) {
      case "kanji":
        return currentWord.kanji;
      case "hiragana":
        return currentWord.hiragana;
      case "arti":
        return currentWord.arti;
    }
  };

  const getBackContent = () => {
    switch (displayMode) {
      case "kanji":
        return (
          <div className="space-y-3">
            <p className="text-2xl text-white">{currentWord.hiragana}</p>
            <p className="text-xl text-white/90">{currentWord.arti}</p>
          </div>
        );
      case "hiragana":
        return (
          <div className="space-y-3">
            <p className="text-4xl text-white">{currentWord.kanji}</p>
            <p className="text-xl text-white/90">{currentWord.arti}</p>
          </div>
        );
      case "arti":
        return (
          <div className="space-y-3">
            <p className="text-4xl text-white">{currentWord.kanji}</p>
            <p className="text-2xl text-white/90">{currentWord.hiragana}</p>
          </div>
        );
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Display mode selector */}
      <div className="flex gap-2 bg-gray-100 rounded-full p-1">
        {(["kanji", "hiragana", "arti"] as DisplayMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setDisplayMode(mode);
              setIsFlipped(false);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              displayMode === mode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {mode === "kanji" ? "Kanji" : mode === "hiragana" ? "Hiragana" : "Arti"}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="text-sm text-gray-500">
        {currentIndex + 1} / {words.length}
      </div>

      {/* Flashcard */}
      <div
        className="relative w-80 h-52 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6">
              <p className="text-5xl font-bold text-white mb-2">{getFrontContent()}</p>
              <p className="text-white/60 text-sm mt-4">Klik untuk melihat jawaban</p>
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6">
              <p className="text-3xl font-bold text-white mb-2">{getFrontContent()}</p>
              {getBackContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Flip"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

      {/* Progress bar */}
      <div className="w-80 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

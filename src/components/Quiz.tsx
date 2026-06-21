import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import type { VocabularyWord } from "../data/vocabulary";
import { shuffleArray } from "../data/vocabulary";

interface QuizProps {
  words: VocabularyWord[];
}

type QuizMode = "kanji-to-arti" | "arti-to-kanji" | "hiragana-to-arti";
type QuizState = "setup" | "playing" | "result";

interface Question {
  word: VocabularyWord;
  options: string[];
  correctAnswer: string;
}

export function Quiz({ words }: QuizProps) {
  const [quizMode, setQuizMode] = useState<QuizMode>("kanji-to-arti");
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateQuestion = useCallback((word: VocabularyWord, allWords: VocabularyWord[]): Question => {
    const otherWords = allWords.filter(w => w !== word);
    const shuffledOthers = shuffleArray(otherWords).slice(0, 3);

    let correctAnswer: string;
    let options: string[];

    switch (quizMode) {
      case "kanji-to-arti":
        correctAnswer = word.arti;
        options = shuffleArray([
          correctAnswer,
          ...shuffledOthers.map(w => w.arti),
        ]);
        break;
      case "arti-to-kanji":
        correctAnswer = word.kanji;
        options = shuffleArray([
          correctAnswer,
          ...shuffledOthers.map(w => w.kanji),
        ]);
        break;
      case "hiragana-to-arti":
        correctAnswer = word.arti;
        options = shuffleArray([
          correctAnswer,
          ...shuffledOthers.map(w => w.arti),
        ]);
        break;
    }

    return { word, options, correctAnswer };
  }, [quizMode]);

  const startQuiz = () => {
    const shuffled = shuffleArray(words);
    const qs = shuffled.map(w => generateQuestion(w, words));
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizState("playing");
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        setQuizState("result");
      }
    }, 1000);
  };

  const getQuestionDisplay = (question: Question) => {
    switch (quizMode) {
      case "kanji-to-arti":
        return (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Apa arti dari:</p>
            <p className="text-6xl font-bold text-gray-800">{question.word.kanji}</p>
            <p className="text-xl text-gray-500 mt-2">{question.word.hiragana}</p>
          </div>
        );
      case "arti-to-kanji":
        return (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Kanji untuk:</p>
            <p className="text-4xl font-bold text-gray-800">{question.word.arti}</p>
          </div>
        );
      case "hiragana-to-arti":
        return (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Apa arti dari:</p>
            <p className="text-5xl font-bold text-gray-800">{question.word.hiragana}</p>
          </div>
        );
    }
  };

  if (quizState === "setup") {
    return (
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">Pengaturan Quiz</h2>

        <div className="w-full space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Mode Quiz:</p>
            <div className="space-y-2">
              {[
                { mode: "kanji-to-arti" as QuizMode, label: "Kanji -> Arti", desc: "Tebak arti dari kanji" },
                { mode: "arti-to-kanji" as QuizMode, label: "Arti -> Kanji", desc: "Tebak kanji dari arti" },
                { mode: "hiragana-to-arti" as QuizMode, label: "Hiragana -> Arti", desc: "Tebak arti dari hiragana" },
              ].map(({ mode, label, desc }) => (
                <button
                  key={mode}
                  onClick={() => setQuizMode(mode)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    quizMode === mode
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="font-medium">{label}</p>
                  <p className={`text-sm ${quizMode === mode ? "text-white/80" : "text-gray-500"}`}>
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              Jumlah soal: <span className="font-bold">{words.length}</span>
            </p>
          </div>

          <button
            onClick={startQuiz}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all shadow-lg"
          >
            Mulai Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizState === "result") {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;

    return (
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="text-center">
          {isPerfect ? (
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          ) : percentage >= 70 ? (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          )}
          <h2 className="text-3xl font-bold text-gray-800">
            {isPerfect ? "Sempurna!" : percentage >= 70 ? "Bagus!" : "Coba Lagi!"}
          </h2>
        </div>

        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-5xl font-bold">{score}</p>
            <p className="text-sm">/{questions.length}</p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              percentage >= 70
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-red-400 to-rose-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xl text-gray-600">Skor: {percentage}%</p>

        <button
          onClick={() => setQuizState("setup")}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Quiz Lagi</span>
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      {/* Progress */}
      <div className="w-full flex items-center gap-4">
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-indigo-600 whitespace-nowrap">
          Skor: {score}
        </span>
      </div>

      {/* Question */}
      <div className="w-full p-8 bg-white rounded-2xl shadow-lg">
        {getQuestionDisplay(currentQuestion)}
      </div>

      {/* Options */}
      <div className="w-full grid grid-cols-1 gap-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          const isWrong = isSelected && !isCorrect;

          let buttonClass = "bg-gray-50 hover:bg-gray-100 border-2 border-gray-200";
          if (selectedAnswer !== null) {
            if (isCorrect) {
              buttonClass = "bg-green-50 border-2 border-green-500 text-green-700";
            } else if (isWrong) {
              buttonClass = "bg-red-50 border-2 border-red-500 text-red-700";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl text-left transition-all ${buttonClass} ${
                selectedAnswer === null ? "hover:scale-[1.02]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {selectedAnswer !== null && (isCorrect || isWrong) && (
                  <span>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

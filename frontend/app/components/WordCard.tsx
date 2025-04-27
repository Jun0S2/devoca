// ✅ app/components/WordCard.tsx
import { speak } from "~/utils/speak";

export function WordCard({
  word,
  lang,
  showAnswer,
  setShowAnswer,
  onNext,
  toggleFavorite,
  isFavorite,
  isVerb,
}: {
  word: {
    word?: string;
    meaning?: string;
    example?: string;
  };
  lang: string | undefined;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  onNext: () => void;
  toggleFavorite: () => void;
  isFavorite: boolean;
  isVerb?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl text-center relative">
      {/* Favorite toggle */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 text-yellow-400 text-2xl"
      >
        {isFavorite ? "★" : "☆"}
      </button>

      {lang === "de" ? (
        <>
          <p className="text-2xl font-semibold text-gray-700">
            {word.meaning ?? ""}
          </p>
          {showAnswer && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-center items-center gap-2">
                <p className="text-3xl font-bold text-gray-800">
                  {word.word ?? ""}
                </p>
                <button onClick={() => speak(word.word ?? "", "de-DE")}>🎧</button>
              </div>
              <div className="flex justify-center items-center gap-2">
                <p className="text-lg italic text-gray-600">
                  {word.example ?? ""}
                </p>
                <button onClick={() => speak(word.example ?? "", "de-DE")}>🎧</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-center items-center gap-2">
            <p className="text-3xl font-bold text-gray-800">
              {word.word ?? ""}
            </p>
            <button onClick={() => speak(word.word ?? "", "de-DE")}>🎧</button>
          </div>
          <div className="flex justify-center items-center gap-2">
            <p className="text-lg italic text-gray-600">
              {word.example ?? ""}
            </p>
            <button onClick={() => speak(word.example ?? "", "de-DE")}>🎧</button>
          </div>
          {showAnswer && (
            <p className="mt-4 text-xl text-gray-700 font-semibold">
              {word.meaning ?? ""}
            </p>
          )}
        </>
      )}

      {/* Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => setShowAnswer(true)}
          className="px-6 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600"
        >
          Answer
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

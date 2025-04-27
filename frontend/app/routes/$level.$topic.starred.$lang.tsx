// app/routes/$level/$topic/$lang.tsx
/**
 * $level.$topic.starred.$lang.tsx
 * @abstract 단어 학습 페이지
 * DE 선택 시 : 한글 뜻이 나온다. ANSWER 버튼을 누르면 reveal
 * KR 선택 시 : 독일어 단어가 나온다. ANSWER 버튼을 누르면 reveal
 * 독일어 TTS 지원
 * -> 기존 페이지에서 starred 목록만 가져오도록 필터링 한다.
 */
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { speak } from "~/utils/speak";

export async function loader({ params }: LoaderFunctionArgs) {
  const { level, topic, lang } = params;

  const { data, error } = await supabase
    .from("vocab")
    .select("word, meaning, example, is_favorite")
    .eq("level", level?.toUpperCase())
    .eq("topic", topic)
    .eq("is_favorite", true) // ⭐ 추가: 즐겨찾기된 단어만 가져오기
    .order("created_at", { ascending: true });

  if (error || !data) {
    throw new Response("Failed to load words", { status: 500 });
  }

  return json({ words: data, lang });
}

export default function FavoritePage() {
  const { words, lang } = useLoaderData<typeof loader>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<typeof words>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { level, topic } = useParams();

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    const favMap: Record<string, boolean> = {};
    words.forEach((w) => {
      favMap[w.word] = w.is_favorite;
    });
    setFavorites(favMap);
  }, [words]);

  const currentWord = shuffledWords[currentIndex];
  if (!currentWord) return <p className="text-center">No words available.</p>;

  const toggleFavorite = async () => {
    const newVal = !favorites[currentWord.word];
    setFavorites((prev) => ({ ...prev, [currentWord.word]: newVal }));
    await supabase
      .from("vocab")
      .update({ is_favorite: newVal })
      .eq("word", currentWord.word);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex flex-col items-center gap-8">
      {/* Navigation */}
      <div className="w-full max-w-3xl flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-500 hover:underline"
        >
          ⬅️ Back
        </button>
        <div className="text-gray-600 text-sm">
          {currentIndex + 1} / {shuffledWords.length}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-3xl h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-purple-500 rounded"
          style={{ width: `${((currentIndex + 1) / shuffledWords.length) * 100}%` }}
        ></div>
      </div>

      {/* Word Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl text-center relative">
        {/* Favorite toggle */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 text-yellow-400 text-2xl"
        >
          {favorites[currentWord.word] ? "★" : "☆"}
        </button>

        {lang === "de" ? (
          <>
            <p className="text-2xl font-semibold text-gray-700">
              {currentWord.meaning}
            </p>
            {showAnswer && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-center items-center gap-2">
                  <p className="text-3xl font-bold text-gray-800">
                    {currentWord.word}
                  </p>
                  <button onClick={() => speak(currentWord.word, "de-DE")}>🎧</button>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <p className="text-lg italic text-gray-600">
                    {currentWord.example}
                  </p>
                  <button onClick={() => speak(currentWord.example, "de-DE")}>🎧</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-center items-center gap-2">
              <p className="text-3xl font-bold text-gray-800">
                {currentWord.word}
              </p>
              <button onClick={() => speak(currentWord.word, "de-DE")}>🎧</button>
            </div>
            <div className="flex justify-center items-center gap-2">
              <p className="text-lg italic text-gray-600">
                {currentWord.example}
              </p>
              <button onClick={() => speak(currentWord.example, "de-DE")}>🎧</button>
            </div>
            {showAnswer && (
              <p className="mt-4 text-xl text-gray-700 font-semibold">
                — {currentWord.meaning}
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
            onClick={() => {
              setShowAnswer(false);
              setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
            }}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
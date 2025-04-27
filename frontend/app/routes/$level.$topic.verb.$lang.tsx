/**
 * $level.$topic.verb.$lang.tsx
 * @abstract 동사 단어 학습 페이지
 * DE 선택 시 : 한글 뜻이 나온다. ANSWER 버튼을 누르면 reveal
 * KR 선택 시 : 독일어 단어가 나온다. ANSWER 버튼을 누르면 reveal
 * 독일어 TTS 지원
 * -> 기존 페이지에서 verb 만 가져오도록 한다
 * -> 기존 카드의 Next 는 Back 과 평행한 곳으로 이동.
 * -> 그 밑에 카드를 3개 더 추가했으면 좋겠음.
 * -> [카드 추가 1] : du : ____, er/es/sie : _____ 
 * -> Answer 버튼 : 클릭 시 du 랑 er form 보여주기 (db- du_form, er_form)
 * [카드 추가 2]
 * -> past : ________
 * -> Answer 버튼 : 클릭 시 past_tense 보여줌
 * [카드 추가 3]
 * -> past particle : _______
 * -> Answer 버튼 : 클릭 시 past_particle 보여줌
 */
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { speak } from "~/utils/speak";
import { Eye, EyeOff } from "lucide-react"; // 눈 아이콘 쓸거면 필요 (lucide-react 추천)

export async function loader({ params }: LoaderFunctionArgs) {
  const { level, topic, lang } = params;

  const { data, error } = await supabase
    .from("vocab")
    .select("word, meaning, example, is_favorite, du_form, er_form, past_tense, past_participle") // ✨ 추가
    .eq("level", level?.toUpperCase())
    .eq("topic", topic)
    .eq("is_verb", true) // ⭐ 추가: 동사만 가져오기
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
  //  Verb state 추가
  const [showDu, setShowDu] = useState(false);
  const [showEr, setShowEr] = useState(false);  
  const [showPast, setShowPast] = useState(false);
  const [showParticiple, setShowParticiple] = useState(false);
  
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
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-500 hover:underline"
          >
            ⬅️ Back
          </button>
          <button
          onClick={() => {
            setShowAnswer(false);
            setShowDu(false);
            setShowEr(false);
            setShowPast(false);
            setShowParticiple(false);
            setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
          }}
          className="text-sm text-blue-500 hover:underline"
        >
          Next ➡️
        </button>
        </div>
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
        </div>
      </div>
      {/* 추가 카드들 */}
      <div className="w-full max-w-3xl flex flex-col gap-4 mt-8">

    {/* 카드 1: du / er */}
    <div className="bg-white rounded-xl shadow p-6">
    <div className="flex flex-col gap-4">

      {/* du 줄 */}
      <div className="flex items-center gap-2">
        <div className="w-[90px] text-gray-800 font-semibold">
          du
        </div>
        <div className="flex-1 border rounded px-4 py-2 bg-gray-50 min-h-[42px] text-gray-700 text-left">
          {showDu ? currentWord.du_form || "" : ""}
        </div>
        <button
          onClick={() => setShowDu(prev => !prev)}
          className="text-gray-600 hover:text-gray-800"
        >
          {showDu ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* er/sie/es 줄 */}
      <div className="flex items-center gap-2">
        <div className="w-[90px] text-gray-800 font-semibold">
          er/sie/es
        </div>
        <div className="flex-1 border rounded px-4 py-2 bg-gray-50 min-h-[42px] text-gray-700 text-left">
          {showEr ? currentWord.er_form || "" : ""}
        </div>
        <button
          onClick={() => setShowEr(prev => !prev)}
          className="text-gray-600 hover:text-gray-800"
        >
          {showEr ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

    </div>
  </div>


  {/* 카드 2: Past Tense */}
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-800 font-semibold mb-2">Past Tense</p>
    <div className="flex items-center gap-2">
     <div className="flex-1 border rounded px-4 py-2 text-left text-gray-700 bg-gray-50 min-h-[42px]">
        {showPast ? currentWord.past_tense || "" : ""}
      </div>
      <button
        onClick={() => setShowPast(prev => !prev)}
        className="text-gray-600 hover:text-gray-800"
      >
        {showPast ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>

  {/* 카드 3: Past Participle */}
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-800 font-semibold mb-2">Past Participle</p>
    <div className="flex items-center gap-2">
      <div className="flex-1 border rounded px-4 py-2 text-left text-gray-700 bg-gray-50 min-h-[42px]">
        {showParticiple ? currentWord.past_participle || "" : ""}
      </div>
      <button
        onClick={() => setShowParticiple(prev => !prev)}
        className="text-gray-600 hover:text-gray-800"
      >
        {showParticiple ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>

      </div>

    </div>
  );
}
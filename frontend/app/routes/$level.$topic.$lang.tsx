// app/routes/$level/$topic/$lang.tsx
/**
 * @abstract 단어 학습 페이지
 * DE 선택 시 : 한글 뜻이 나온다. ANSWER 버튼을 누르면 reveal
 * KR 선택 시 : 독일어 단어가 나온다. ANSWER 버튼을 누르면 reveal
 * 독일어 TTS 지원
 */
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { WordNavigation } from "~/components/WordNavigation";
import { ProgressBar } from "~/components/ProgressBar";
import { WordCard } from "~/components/WordCard";

export async function loader({ params }: LoaderFunctionArgs) {
  const { level, topic, lang } = params;

  const { data, error } = await supabase
    .from("vocab")
    .select("word, meaning, example, is_favorite")
    .eq("level", level?.toUpperCase())
    .eq("topic", topic)
    .order("created_at", { ascending: true });

  if (error || !data) {
    throw new Response("Failed to load words", { status: 500 });
  }

  return json({ words: data, lang });
}

export default function PracticePage() {
  const { words, lang } = useLoaderData<typeof loader>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<typeof words>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

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

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
  };

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
      <WordNavigation
        currentIndex={currentIndex}
        total={shuffledWords.length}
      />

      {/* Progress */}
      <ProgressBar
        currentIndex={currentIndex}
        total={shuffledWords.length}
      />

      {/* Word Card */}
      <WordCard
        word={currentWord}
        lang={lang ?? ""}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        toggleFavorite={toggleFavorite}
        isFavorite={favorites[currentWord.word]}
        onNext={handleNext}
      />
    </div>
  );
}

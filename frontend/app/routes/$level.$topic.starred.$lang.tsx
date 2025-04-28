// app/routes/$level/$topic/$lang.tsx
/**
 * $level.$topic.starred.$lang.tsx
 * @abstract 단어 학습 페이지
 * DE 선택 시 : 한글 뜻이 나온다. ANSWER 버튼을 누르면 reveal
 * KR 선택 시 : 독일어 단어가 나온다. ANSWER 버튼을 누르면 reveal
 * 독일어 TTS 지원
 * -> 기존 페이지에서 starred 목록만 가져오도록 필터링 한다.
 */
import { useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { WordNavigation } from "~/components/WordNavigation";
import { ProgressBar } from "~/components/ProgressBar";
import { WordCard } from "~/components/WordCard";
import { useSubtopicFilter } from "~/hooks/useSubtopicFilter"; // ✅ 추가
import { SubtopicsDropdown } from "~/components/SubtopicsDropdown"; // ✅ 추가

export async function loader({ params }: LoaderFunctionArgs) {
  const { level, topic, lang } = params;

  const { data, error } = await supabase
    .from("vocab")
    .select("word, meaning, example, is_favorite, subtopic") // ✅ subtopic 추가
    .eq("level", level?.toUpperCase())
    .eq("topic", topic)
    .eq("is_favorite", true) // ⭐ 즐겨찾기 필터
    .order("created_at", { ascending: true });

  if (error || !data) {
    throw new Response("Failed to load words", { status: 500 });
  }

  const subtopics = Array.from(new Set(data.map((w) => w.subtopic))).filter(Boolean);

  return json({ words: data, lang, subtopics });
}

export default function FavoritePage() {
  const { words, lang, subtopics } = useLoaderData<typeof loader>();
  const {
    selectedSubtopic,
    setSelectedSubtopic,
    currentWord,
    currentIndex,
    total,
    handleNext,
    showAnswer,
    setShowAnswer,
  } = useSubtopicFilter(words);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const favMap: Record<string, boolean> = {};
    words.forEach((w) => {
      favMap[w.word] = w.is_favorite;
    });
    setFavorites(favMap);
  }, [words]);

  const toggleFavorite = async () => {
    if (!currentWord) return;
    const newVal = !favorites[currentWord.word];
    setFavorites((prev) => ({ ...prev, [currentWord.word]: newVal }));
    await supabase
      .from("vocab")
      .update({ is_favorite: newVal })
      .eq("word", currentWord.word);
  };
  if (!currentWord) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500">No words available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex flex-col items-center gap-8">
      <SubtopicsDropdown
        subtopics={subtopics}
        selectedSubtopic={selectedSubtopic}
        onSelectSubtopic={setSelectedSubtopic}
      />
      <WordNavigation currentIndex={currentIndex} total={total} />
      <ProgressBar currentIndex={currentIndex} total={total} />
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

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
import { SubtopicsDropdown } from "~/components/SubtopicsDropdown"; // ✅ 추가
import { useSubtopicFilter } from "~/hooks/useSubtopicFilter"; // ✅ Subtopic Hook import

export async function loader({ params }: LoaderFunctionArgs) {
  const { level, topic, lang } = params;

  const { data, error } = await supabase
    .from("vocab")
    .select("word, meaning, example, is_favorite, subtopic")
    .eq("level", level?.toUpperCase())
    .eq("topic", topic)
    .order("created_at", { ascending: true });

  if (error || !data) {
    throw new Response("Failed to load words", { status: 500 });
  }
  // subtopics 추가
  const subtopics = Array.from(new Set(data.map((w) => w.subtopic))).filter(Boolean);
  return json({ words: data, lang, subtopics });
}

export default function PracticePage() {
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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-center text-gray-500">No words available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex flex-col items-center gap-8">
      {/* Subtopic Select UI */}
      <SubtopicsDropdown
        subtopics={subtopics}
        selectedSubtopic={selectedSubtopic}
        onSelectSubtopic={setSelectedSubtopic}
      />
      {/* Navigation */}
      <WordNavigation
        currentIndex={currentIndex}
        total={total}
      />

      {/* Progress */}
      <ProgressBar
      currentIndex={currentIndex}
      total={total}
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

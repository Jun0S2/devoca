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

import { useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { WordNavigation } from "~/components/WordNavigation";
import { ProgressBar } from "~/components/ProgressBar";
import { WordCard } from "~/components/WordCard";
import { Eye, EyeOff } from "lucide-react";
import { VerbDetailCard } from "~/components/VerbDetailCard";
export async function loader({ params }: LoaderFunctionArgs) {
  const { level, topic, lang } = params;

  const { data, error } = await supabase
    .from("vocab")
    .select("word, meaning, example, is_favorite, du_form, er_form, past_tense, past_participle")
    .eq("level", level?.toUpperCase())
    .eq("topic", topic)
    .eq("is_verb", true)
    .order("created_at", { ascending: true });

  if (error || !data) {
    throw new Response("Failed to load words", { status: 500 });
  }

  return json({ words: data, lang });
}

export default function VerbPracticePage() {
  const { words, lang } = useLoaderData<typeof loader>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [shuffledWords, setShuffledWords] = useState<typeof words>([]);
  
  // 추가: verb 전용 상태
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

  const handleNext = () => {
    setShowAnswer(false);
    setShowDu(false);
    setShowEr(false);
    setShowPast(false);
    setShowParticiple(false);
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex flex-col items-center gap-8">
      <WordNavigation currentIndex={currentIndex} total={shuffledWords.length} />
      <ProgressBar currentIndex={currentIndex} total={shuffledWords.length} />

      <WordCard
        word={currentWord}
        lang={lang}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        toggleFavorite={toggleFavorite}
        isFavorite={favorites[currentWord.word]}
        onNext={handleNext}
        isVerb // <-- ⭐️ verb 모드
      />
      {/* Verb 전용 카드들 */}
      <div className="w-full max-w-3xl flex flex-col gap-4">
        <VerbDetailCard
          items={[
            { label: "du", value: currentWord.du_form || "", hidden: !showDu, onToggle: () => setShowDu(prev => !prev) },
            { label: "er/sie/es", value: currentWord.er_form || "", hidden: !showEr, onToggle: () => setShowEr(prev => !prev) },
            { label: "Past Tense", value: currentWord.past_tense || "", hidden: !showPast, onToggle: () => setShowPast(prev => !prev) },
            { label: "Past Participle", value: currentWord.past_participle || "", hidden: !showParticiple, onToggle: () => setShowParticiple(prev => !prev) },
          ]}
        />

      </div>
    </div>
  );
}

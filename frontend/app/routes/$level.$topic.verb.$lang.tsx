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
import { useSubtopicFilter } from "~/hooks/useSubtopicFilter";
/** Components */
import { SubtopicsDropdown } from "~/components/SubtopicsDropdown";
import { WordNavigation } from "~/components/WordNavigation";
import { ProgressBar } from "~/components/ProgressBar";
import { WordCard } from "~/components/WordCard";
import { VerbDetailCard } from "~/components/VerbDetailCard";

export async function loader({ params }: LoaderFunctionArgs) {
  const { level, topic, lang } = params;

  const { data, error } = await supabase
    .from("vocab")
    .select("word, meaning, example, is_favorite, subtopic, du_form, er_form, past_tense, past_participle") // ✅ subtopic 추가!
    .eq("level", level?.toUpperCase())
    .eq("topic", topic)
    .eq("is_verb", true)
    .order("created_at", { ascending: true });

  if (error || !data) {
    throw new Response("Failed to load words", { status: 500 });
  }
  const subtopics = Array.from(new Set(data.map((w) => w.subtopic))).filter(Boolean);

  return json({ words: data, lang, subtopics });
}

export default function VerbPracticePage() {
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
  const [showDu, setShowDu] = useState(false);
  const [showEr, setShowEr] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [showParticiple, setShowParticiple] = useState(false);

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
      {/* ⭐ SubtopicsDropdown 추가 */}
      <SubtopicsDropdown
        subtopics={subtopics}
        selectedSubtopic={selectedSubtopic}
        onSelectSubtopic={setSelectedSubtopic}
      />

      {/* 기본 네비게이션 */}
      <WordNavigation currentIndex={currentIndex} total={total} />
      <ProgressBar currentIndex={currentIndex} total={total} />

      {/* 메인 WordCard */}
      <WordCard
        word={currentWord}
        lang={lang ?? ""}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        toggleFavorite={toggleFavorite}
        isFavorite={favorites[currentWord.word]}
        onNext={() => {
          handleNext();
          setShowDu(false);
          setShowEr(false);
          setShowPast(false);
          setShowParticiple(false);
        }}
        isVerb
      />

      {/* Verb 전용 추가 카드 */}
      <div className="w-full max-w-3xl flex flex-col gap-4">
        <VerbDetailCard
          items={[
            { label: "du", value: currentWord.du_form ?? "", hidden: !showDu, onToggle: () => setShowDu((p) => !p) },
            { label: "er/sie/es", value: currentWord.er_form ?? "", hidden: !showEr, onToggle: () => setShowEr((p) => !p) },
            { label: "Past Tense", value: currentWord.past_tense ?? "", hidden: !showPast, onToggle: () => setShowPast((p) => !p) },
            { label: "Past Participle", value: currentWord.past_participle ?? "", hidden: !showParticiple, onToggle: () => setShowParticiple((p) => !p) },
          ]}
        />
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

export function useSubtopicFilter<T extends { subtopic?: string }>(words: T[]) {
  const [selectedSubtopic, setSelectedSubtopic] = useState("All");
  const [filteredWords, setFilteredWords] = useState<T[]>([]);
  const [shuffledWords, setShuffledWords] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fw = selectedSubtopic === "All"
      ? words
      : words.filter((w) => w.subtopic === selectedSubtopic);
    setFilteredWords(fw);
  }, [selectedSubtopic, words]);

  useEffect(() => {
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [filteredWords]);

  useEffect(() => {
    if (shuffledWords.length > 0 && currentIndex >= shuffledWords.length) {
      setCurrentIndex(0);
    }
  }, [shuffledWords, currentIndex]);

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
  };

  const currentWord = shuffledWords[currentIndex];

  return {
    selectedSubtopic,
    setSelectedSubtopic,
    currentWord,     // ✅ 그대로
    currentIndex,     // ✅ 따로
    total: shuffledWords.length, // ✅ 따로
    handleNext,
    showAnswer,
    setShowAnswer,
  };
}

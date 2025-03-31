// app/routes/$level/$topic/practice.tsx
/**
 * @abstract 연습 문제 유형 선택 페이지
 */
import { Link, useParams } from "@remix-run/react";

export default function PracticeModeSelector() {
  const { level, topic } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 flex flex-col items-center gap-12">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Practice Mode for <span className="text-purple-600">{topic}</span> ({level})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link
          to={`/${level}/${topic}/problems?mode=fill-word`}
          className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-xl hover:bg-purple-50 transition"
        >
          <p className="text-2xl font-semibold text-gray-700 mb-4">❓ Fill in the Word</p>
          <p className="text-gray-500 text-center">뜻을 보고 단어를 빈칸에 채워보세요</p>
        </Link>

        <Link
          to={`/${level}/${topic}/problems?mode=fill-meaning`}
          className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-xl hover:bg-purple-50 transition"
        >
          <p className="text-2xl font-semibold text-gray-700 mb-4">📝 Fill in the Meaning</p>
          <p className="text-gray-500 text-center">단어를 보고 뜻을 빈칸에 채워보세요</p>
        </Link>
      </div>
    </div>
  );
}

// app/routes/$level/topics/$topic.tsx
/**
 * @abstract 주제별 단어 공부 언어 선택 또는 시험지 선택 페이지
 */
import { useParams, Link } from "@remix-run/react";
import { BackButton } from "~/utils/backforsameurl";
export default function TopicDetailPage() {
  const { level, topic } = useParams();

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full flex flex-col items-center gap-10">
      {/* 제목 */}
        <h1 className="text-3xl font-extrabold text-gray-800 text-center">
          📂 Topic:{" "}
          <span className="text-purple-600">{topic}</span>{" "}
          <span className="text-gray-400 text-xl">({level?.toUpperCase()})</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Practice Card */}
          <Card
            title="📚 Practice"
            buttons={[
              { label: "DE", href: `/${level}/${topic}/de` },
              { label: "KR", href: `/${level}/${topic}/kr` },
            ]}
          />
         {/* 오답노트 */}
         <Card
            title="⭐ Starred"
            buttons={[
              { label: "DE", href: `/${level}/${topic}/starred/de` },
              { label: "KR", href: `/${level}/${topic}/starred/kr` },
            ]}
          />
        {/* 동사 practice */}
         <Card
            title="🚀 Verb Practice"
            buttons={[
              { label: "DE", href: `/${level}/${topic}/verb/de` },
              { label: "KR", href: `/${level}/${topic}/verb/kr` },
            ]}
          />
          {/* Test PDF Card */}
          <Card
            title="📝 Test PDF"
            buttons={[
              { label: "Answers", href: `/${level}/${topic}/answers` },
              { label: "Problems", href: `/${level}/${topic}/problems` },
            ]}
          />
        </div>
        <BackButton />
      </div>
    </div>
  );
}

function Card({
  title,
  buttons,
}: {
  title: string;
  buttons: { label: string; href: string }[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02] p-6 flex flex-col justify-between items-center h-80">
      <div className="text-2xl font-semibold text-gray-800 mb-4">{title}</div>
      <div className="flex w-full gap-4 p-10 flex-1 items-stretch">
        {buttons.map(({ label, href }) => (
          <Link
            key={label}
            to={href}
            className="flex-1 flex items-center justify-center border border-gray-200 rounded-xl shadow-sm text-gray-800 font-bold text-lg hover:bg-fuchsia-100 hover:shadow-fuchsia-300 transition-all duration-200"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
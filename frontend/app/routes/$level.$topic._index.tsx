// app/routes/$level/topics/$topic.tsx
/**
 * @abstract 주제별 단어 공부 언어 선택 또는 시험지 선택 페이지
 */
import { useParams, Link } from "@remix-run/react";
import { BackButton } from "~/utils/backforsameurl";
import { MenuCard } from "~/components/MenuCard";
export default function TopicDetailPage() {
  const { level, topic } = useParams();

  const menuList = [
    {
      title: "📚 Practice",
      buttons: [
        { label: "DE", href: `/${level}/${topic}/de` },
        { label: "KR", href: `/${level}/${topic}/kr` },
      ],
    },
    {
      title: "⭐ Starred",
      buttons: [
        { label: "DE", href: `/${level}/${topic}/starred/de` },
        { label: "KR", href: `/${level}/${topic}/starred/kr` },
      ],
    },
    {
      title: "🚀 Verb Practice",
      buttons: [
        { label: "DE", href: `/${level}/${topic}/verb/de` },
        { label: "KR", href: `/${level}/${topic}/verb/kr` },
      ],
    },
    {
      title: "📝 Test PDF",
      buttons: [
        { label: "Answers", href: `/${level}/${topic}/answers` },
        { label: "Problems", href: `/${level}/${topic}/problems` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full flex flex-col items-center gap-10">
        {/* 제목 */}
        <h1 className="text-3xl font-extrabold text-gray-800 text-center">
          📂 Topic:{" "}
          <span className="text-purple-600">{topic}</span>{" "}
          <span className="text-gray-400 text-xl">({level?.toUpperCase()})</span>
        </h1>

        {/* 메뉴 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {menuList.map((menu) => (
            <MenuCard key={menu.title} title={menu.title} buttons={menu.buttons} />
          ))}
        </div>

        <BackButton />
      </div>
    </div>
  );
}

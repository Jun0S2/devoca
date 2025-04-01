// app/routes/$level._index.tsx
/**
 * @abstract 단어 주제 선택 페이지
 * @param {level} level - 단어 수준 (A1, A2, B1, B2, C1, C2)
 * @returns {topics} topics - 단어 주제 목록
 */
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { supabase } from "~/lib/supabase";

export async function loader({ params }: { params: { level: string } }) {
  const level = params.level?.toUpperCase() ?? "A1";

  const { data, error } = await supabase
    .from("vocab")
    .select("topic")
    .eq("level", level);

  if (error) {
    console.error("🔴 Supabase error:", error);
    throw new Response("Failed to load topics", { status: 500 });
  }

  const uniqueTopics = Array.from(new Set(data.map((item) => item.topic))).filter(Boolean);
  return json({ level, topics: uniqueTopics });
}

export default function TopicsPage() {
  const { level, topics } = useLoaderData<typeof loader>();

  return (
    <div className="p-8 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{level} 단어 주제 선택</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {topics.map((topic: string) => (
          <Link 
            to={`/${level}/${encodeURIComponent(topic)}`}
            key={topic}
            className="block border rounded-lg p-4 shadow hover:shadow-lg transition 
                      hover:bg-blue-50 dark:hover:bg-gray-700
                      bg-white dark:bg-gray-800
                      border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{topic}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
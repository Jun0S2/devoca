import { Link, useParams } from "@remix-run/react";
import { useRef } from "react";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabase";
import { PdfDownloader } from "~/utils/pdf-downloader";
import { BackButton } from "~/utils/backforsameurl";

export async function loader({ params }: LoaderFunctionArgs) {
  const { level, topic } = params;

  const { data, error } = await supabase
    .from("vocab")
    .select("word, meaning")
    .eq("level", level?.toUpperCase())
    .eq("topic", topic);

  if (error || !data) {
    throw new Response("Failed to load vocab", { status: 500 });
  }

  return json({ words: data, level, topic });
}

export default function PracticeModeSelector() {
  const { level, topic } = useParams();
  const { words } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "fill-word";
  const pdfRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-white p-8">
      <div ref={pdfRef} className="max-w-5xl mx-auto">
        <BackButton />
        
        {/* 메인 타이틀 영역 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center">
            Practice Mode for <span className="text-purple-600">{topic}</span> ({level})
          </h1>
        </div>

        {/* 모드 선택 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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

        {/* 문제 테이블 영역 */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {mode === "fill-word" ? "❓ Fill in the Word" : "📝 Fill in the Meaning"}
            </h2>
            <PdfDownloader
              contentRef={pdfRef}
              filename={`${topic}-${mode}.pdf`}
              buttonText="Download PDF"
            />
          </div>

          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">{mode === "fill-word" ? "Meaning" : "Word"}</th>
                <th className="border px-4 py-2">
                  {mode === "fill-word" ? "Word" : "Meaning"}
                </th>
              </tr>
            </thead>
            <tbody>
              {words.map((w, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2 text-center">{i + 1}</td>
                  <td className="border px-4 py-2">
                    {mode === "fill-word" ? w.meaning : w.word}
                  </td>
                  <td className="border px-4 py-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
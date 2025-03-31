// app/routes/$level/$topic/answers.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { supabase } from "~/lib/supabase";
import { useRef } from "react";
import { PdfDownloader } from "~/utils/pdf-downloader";

export async function loader({ params }: LoaderFunctionArgs) {
  const { level, topic } = params;

  const { data, error } = await supabase
    .from("vocab")
    .select("word, meaning, example")
    .eq("level", level?.toUpperCase())
    .eq("topic", topic);

  if (error || !data) {
    throw new Response("Failed to load words", { status: 500 });
  }

  return json({ level, topic, words: data });
}

export default function AnswersPage() {
  const { level, topic, words } = useLoaderData<typeof loader>();
  const pdfRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-white p-8">
      <div ref={pdfRef} className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold mb-4">
          📘 {level?.toUpperCase()} / {topic} - Word List
        </h1>

        <PdfDownloader
          contentRef={pdfRef}
          filename={`${level}-${topic}-answers.pdf`}
          buttonText="Download PDF"
          className="mb-4"
        />
</div>
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Word</th>
              <th className="border px-4 py-2">Meaning</th>
              <th className="border px-4 py-2">Example</th>
            </tr>
          </thead>
          <tbody>
            {words.map((w, idx) => (
              <tr key={w.word} className="even:bg-gray-50">
                <td className="border px-4 py-2 text-center">{idx + 1}</td>
                <td className="border px-4 py-2">{w.word}</td>
                <td className="border px-4 py-2">{w.meaning}</td>
                <td className="border px-4 py-2 italic text-gray-600">{w.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
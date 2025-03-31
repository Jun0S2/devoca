import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";

export default function AddNewWordPage() {
  const [form, setForm] = useState({
    level: "A1",
    word: "",
    meaning: "",
    example: "",
    topic: "",
    subtopic: "",
  });

  const [message, setMessage] = useState("");
  const [topicOptions, setTopicOptions] = useState<string[]>([]);
  const [subtopicOptions, setSubtopicOptions] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ topic 자동완성
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (form.topic.trim().length > 0) {
        const { data, error } = await supabase
          .from("vocab")
          .select("topic")
          .ilike("topic", `%${form.topic}%`)
          .limit(5);

        if (!error && data) {
          const unique = Array.from(new Set(data.map((row) => row.topic))).filter(Boolean);
          setTopicOptions(unique);
        }
      } else {
        setTopicOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [form.topic]);

  // ✅ subtopic 자동완성
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (form.subtopic.trim().length > 0) {
        const { data, error } = await supabase
          .from("vocab")
          .select("subtopic")
          .ilike("subtopic", `%${form.subtopic}%`)
          .limit(5);

        if (!error && data) {
          const unique = Array.from(new Set(data.map((row) => row.subtopic))).filter(Boolean);
          setSubtopicOptions(unique);
        }
      } else {
        setSubtopicOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [form.subtopic]);

  // ✅ 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("vocab").insert([
      {
        ...form,
        is_wrong: false,
        is_favorite: false,
      },
    ]);

    if (error) {
      setMessage("❌ 저장 실패: " + error.message);
    } else {
      setMessage("✅ 단어 저장 완료!");
      setForm({
        level: "A1",
        word: "",
        meaning: "",
        example: "",
        topic: "",
        subtopic: "",
      });
      setTopicOptions([]);
      setSubtopicOptions([]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 border p-6 rounded-lg shadow bg-white"
      >
        <h1 className="text-2xl font-bold text-center">Add a New Word</h1>

        {/* Level */}
        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
        </select>

        {/* Word */}
        <Input name="word" value={form.word} onChange={handleChange} placeholder="독일어 단어" />

        {/* Meaning */}
        <Input name="meaning" value={form.meaning} onChange={handleChange} placeholder="뜻 (한국어)" />

        {/* Example */}
        <Input name="example" value={form.example} onChange={handleChange} placeholder="예문" />

        {/* Topic with autocomplete */}
        <AutocompleteInput
          label="주제 (예: 가족)"
          name="topic"
          value={form.topic}
          onChange={handleChange}
          options={topicOptions}
          onSelect={(val) => {
            setForm((prev) => ({ ...prev, topic: val }));
            setTopicOptions([]);
          }}
        />

        {/* Subtopic with autocomplete */}
        <AutocompleteInput
          label="소주제"
          name="subtopic"
          value={form.subtopic}
          onChange={handleChange}
          options={subtopicOptions}
          onSelect={(val) => {
            setForm((prev) => ({ ...prev, subtopic: val }));
            setSubtopicOptions([]);
          }}
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          단어 추가
        </button>

        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}

// ✅ 일반 Input 컴포넌트
function Input({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border px-3 py-2 rounded"
    />
  );
}

// ✅ 자동완성 Input 컴포넌트
function AutocompleteInput({
  label,
  name,
  value,
  onChange,
  options,
  onSelect,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: string[];
  onSelect: (value: string) => void;
}) {
  const [showOptions, setShowOptions] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowOptions(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* 입력창 + 버튼을 같은 줄에 */}
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => {
            onChange(e);
            setShowOptions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={label}
          className="flex-1 border px-3 py-2 rounded"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShowOptions(false)}
          className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          title="입력 확정"
        >
          확인
        </button>
      </div>

      {/* 자동완성 목록 */}
      {showOptions && options.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt}
              className="cursor-pointer px-3 py-2 hover:bg-blue-100"
              onClick={() => {
                onSelect(opt);
                setShowOptions(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
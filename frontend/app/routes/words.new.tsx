import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import { TagAutocompleteInput } from "~/utils/TagAutocompleteInput";

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
  const [searchTopic, setSearchTopic] = useState("");
  const [searchSubtopic, setSearchSubtopic] = useState("");

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchTopic.trim()) {
        const { data, error } = await supabase
          .from("vocab")
          .select("topic")
          .ilike("topic", `%${searchTopic}%`)
          .limit(5);
        if (!error && data) {
          const unique = [...new Set(data.map((row) => row.topic))].filter(Boolean);
          setTopicOptions(unique);
        }
      } else {
        setTopicOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTopic]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchSubtopic.trim() && form.topic.trim()) {
        const { data, error } = await supabase
          .from("vocab")
          .select("subtopic")
          .eq("topic", form.topic)
          .ilike("subtopic", `%${searchSubtopic}%`)
          .limit(5);
        if (!error && data) {
          const unique = [...new Set(data.map((row) => row.subtopic))].filter(Boolean);
          setSubtopicOptions(unique);
        }
      } else {
        setSubtopicOptions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchSubtopic, form.topic]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
      setForm((prev) => ({
        ...prev,
        word: "",
        meaning: "",
        example: "",
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 border p-6 rounded-lg shadow bg-white"
      >
        <h1 className="text-2xl font-bold text-center">Add a New Word</h1>

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

        <Input name="word" value={form.word} onChange={handleChange} placeholder="독일어 단어" />
        <Input name="meaning" value={form.meaning} onChange={handleChange} placeholder="뜻 (한국어)" />
        <Input name="example" value={form.example} onChange={handleChange} placeholder="예문" />

        <TagAutocompleteInput
          label="주제 (예: 가족)"
          value={form.topic}
          search={searchTopic}
          onSearchChange={setSearchTopic}
          options={topicOptions}
          onSelect={(val) => {
            setForm((prev) => ({ ...prev, topic: val }));
            setSearchTopic("");
          }}
          onClear={() => {
            setForm((prev) => ({ ...prev, topic: "" }));
            setSearchTopic("");
          }}
        />

        <TagAutocompleteInput
          label="소주제"
          value={form.subtopic}
          search={searchSubtopic}
          onSearchChange={setSearchSubtopic}
          options={subtopicOptions}
          onSelect={(val) => {
            setForm((prev) => ({ ...prev, subtopic: val }));
            setSearchSubtopic("");
          }}
          onClear={() => {
            setForm((prev) => ({ ...prev, subtopic: "" }));
            setSearchSubtopic("");
          }}
        />

        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          단어 추가
        </button>

        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}

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

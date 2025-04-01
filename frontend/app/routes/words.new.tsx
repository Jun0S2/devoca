// words.new.tsx
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import { TagAutocompleteInput } from "~/utils/TagAutoCompleteInput"

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

  const isFormValid = () => {
    return (
      form.word.trim() !== "" &&
      form.meaning.trim() !== "" &&
      form.example.trim() !== "" &&
      form.topic.trim() !== "" &&
      form.subtopic.trim() !== ""
    );
  };

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchTopic.trim() && !form.topic) {
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
  }, [searchTopic, form.topic]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchSubtopic.trim() && !form.subtopic && form.topic) {
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
  }, [searchSubtopic, form.topic, form.subtopic]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setMessage("❌ 모든 필드를 채워주세요");
      return;
    }

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
      // topic과 subtopic은 유지
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
          onConfirm={() => {
            if (searchTopic.trim()) {
              setForm((prev) => ({ ...prev, topic: searchTopic }));
              setSearchTopic("");
            }
          }}
          disabled={!!form.topic}
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
      onConfirm={() => {
        if (searchSubtopic.trim()) {
          setForm((prev) => ({ ...prev, subtopic: searchSubtopic }));
          setSearchSubtopic("");
        }
      }}
      disabled={!!form.subtopic}
    />

        <button 
          type="submit" 
          disabled={!isFormValid()}
          className={`w-full px-4 py-2 rounded ${
            isFormValid() 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
          }`}
        >
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
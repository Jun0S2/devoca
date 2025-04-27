import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import { TagAutocompleteInput } from "~/utils/TagAutoCompleteInput";

export default function AddNewWordPage() {
  const [form, setForm] = useState({
    level: "A1",
    word: "",
    meaning: "",
    example: "",
    topic: "",
    subtopic: "",
    is_verb: false,          // 동사인 경우 추가
    past_tense: "", 
    past_participle: "", 
    du_form: "", 
    er_form: "", 
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow bg-white dark:bg-gray-800"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Add a New Word
        </h1>

        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded"        >
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
        </select>

        <Input name="word" value={form.word} onChange={handleChange} placeholder="독일어 단어"/>
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
        {/* checkbox - verb? */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_verb"
            checked={form.is_verb}
            onChange={handleChange}
            className="form-checkbox accent-blue-600 dark:accent-blue-400"
            />
          <span className="text-gray-800 dark:text-white">동사입니까?</span>
        </label>

      {/* Case - verb? */}
      {form.is_verb && (
        <div className="space-y-2">
          <Input
            name="du_form"
            value={form.du_form}
            onChange={handleChange}
            placeholder="du 형태 (z.B. heißt)"
          />
          <Input
            name="er_form"
            value={form.er_form}
            onChange={handleChange}
            placeholder="er/sie/es 형태 (z.B. heißt)"
          />
          <Input
            name="past_tense"
            value={form.past_tense}
            onChange={handleChange}
            placeholder="과거형 (z.B. ging)"
          />
          <Input
            name="past_participle"
            value={form.past_participle}
            onChange={handleChange}
            placeholder="과거분사형 (z.B. gegangen)"
          />
        </div>
      )}
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

        {message && <p className="text-center mt-2 text-gray-800">{message}</p>}
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
      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded"    />
  );
}
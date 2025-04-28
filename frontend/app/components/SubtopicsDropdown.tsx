// ✅ app/components/SubtopicsDropdown.tsx
import React from "react";

interface SubtopicsDropdownProps {
  subtopics: string[];
  selectedSubtopic: string;
  onSelectSubtopic: (subtopic: string) => void;
}

export function SubtopicsDropdown({
  subtopics,
  selectedSubtopic,
  onSelectSubtopic,
}: SubtopicsDropdownProps) {
  return (
    <div className="w-full max-w-3xl flex justify-end">
      <select
        value={selectedSubtopic}
        onChange={(e) => onSelectSubtopic(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="All">All</option>
        {subtopics.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>
    </div>
  );
}

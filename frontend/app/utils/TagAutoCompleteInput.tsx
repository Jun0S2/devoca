// utils/TagAutoCompleteInput.tsx
import { useState } from "react";

export function TagAutocompleteInput({
  label,
  value,
  search,
  onSearchChange,
  options,
  onSelect,
  onClear,
  onConfirm,
  disabled = false,
}: {
  label: string;
  value: string;
  search: string;
  onSearchChange: (val: string) => void;
  options: string[];
  onSelect: (val: string) => void;
  onClear: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [showOptions, setShowOptions] = useState(false);

  if (disabled) {
    return (
      <div className="flex items-center justify-between bg-sky-100 px-3 py-2 rounded">
        <span className="text-sky-600 font-medium">{value}</span>
        <button 
          type="button"
          onClick={onClear} 
          className="text-sky-400 hover:text-sky-600 ml-2 text-lg"
        >
          &times;
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {value ? (
        <div className="flex items-center justify-between bg-sky-100 px-3 py-2 rounded">
          <span className="text-sky-600 font-medium">{value}</span>
          <button 
            type="button"
            onClick={onClear} 
            className="text-sky-400 hover:text-sky-600 ml-2 text-lg"
          >
            &times;
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowOptions(true);
            }}
            placeholder={label}
            className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => {
              setShowOptions(false);
              onConfirm();
            }}
            className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            확인
          </button>
        </div>
      )}

      {showOptions && options.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt}
              className="cursor-pointer px-3 py-2 hover:bg-blue-100 text-gray-800"
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
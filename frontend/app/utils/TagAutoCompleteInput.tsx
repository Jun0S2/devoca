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
      <div className="flex items-center justify-between bg-sky-100 dark:bg-sky-900 px-3 py-2 rounded">
        <span className="text-sky-600 dark:text-sky-200 font-medium">{value}</span>
        <button 
          type="button"
          onClick={onClear} 
          className="text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 ml-2 text-lg"
        >
          &times;
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {value ? (
        <div className="flex items-center justify-between bg-sky-100 dark:bg-sky-900 px-3 py-2 rounded">
          <span className="text-sky-600 dark:text-sky-200 font-medium">{value}</span>
          <button 
            type="button"
            onClick={onClear} 
            className="text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 ml-2 text-lg"
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
            className="flex-1 border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => {
              setShowOptions(false);
              onConfirm();
            }}
            className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          >
            확인
          </button>
        </div>
      )}

      {showOptions && options.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow-lg max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt}
              className="cursor-pointer px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 dark:text-white"
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
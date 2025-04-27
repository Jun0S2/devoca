// app/components/VerbDetailCard.tsx
import { Eye, EyeOff } from "lucide-react";

export function VerbDetailCard({
  items,
}: {
  items: { label: string; value: string; hidden: boolean; onToggle: () => void }[];
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
    <p className="text-3xl font-bold text-gray-800">
        동사 변형
    </p>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className="w-[90px] text-gray-800 font-semibold">{item.label}</div>
          <div className="flex-1 border rounded px-4 py-2 bg-gray-50 min-h-[42px] text-gray-700 text-left">
            {item.hidden ? "" : item.value}
          </div>
          <button
            onClick={item.onToggle}
            className="text-gray-600 hover:text-gray-800"
          >
            {item.hidden ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      ))}
    </div>
  );
}

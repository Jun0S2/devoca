// ✅ app/components/WordNavigation.tsx
import { useNavigate } from "@remix-run/react";

export function WordNavigation({
  currentIndex,
  total,
}: {
  currentIndex: number;
  total: number;
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-3xl flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-500 hover:underline"
        >
          ⬅️ Back
        </button>
      </div>
      <div className="text-gray-600 text-sm">
        {currentIndex + 1} / {total}
      </div>
    </div>
  );
}

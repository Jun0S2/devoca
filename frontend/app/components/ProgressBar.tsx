// ✅ app/components/ProgressBar.tsx

export function ProgressBar({
    currentIndex,
    total,
  }: {
    currentIndex: number;
    total: number;
  }) {
    const progress = ((currentIndex + 1) / total) * 100;
  
    return (
      <div className="w-full max-w-3xl h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-purple-500 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  }
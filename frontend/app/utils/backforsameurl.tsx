import { useLocation, useNavigate } from "@remix-run/react";

export function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    const segments = location.pathname.split("/");
    if (segments.length > 2) {
      segments.pop(); // 마지막 segment 제거
      const previousPath = segments.join("/");
      navigate(previousPath);
    } else {
      navigate("/"); // fallback: 너무 짧은 경로일 경우 홈으로
    }
  };

  return (
    <button
      onClick={handleBack}
      className="text-sm text-blue-500 hover:underline"
    >
      ⬅️ Back
    </button>
  );
}

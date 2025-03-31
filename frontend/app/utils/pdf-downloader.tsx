// app/components/pdf-downloader.tsx
import { useRef, useState, useEffect } from "react";

export function PdfDownloader({
  contentRef,
  filename,
  buttonText = "Download PDF",
  className = "",
}: {
  contentRef: React.RefObject<HTMLDivElement>;
  filename: string;
  buttonText?: string;
  className?: string;
}) {
  const [html2pdf, setHtml2pdf] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      import("html2pdf.js").then((module) => setHtml2pdf(() => module.default));
    }
  }, []);

  const handleDownloadPDF = () => {
    if (!contentRef.current || !html2pdf) return;

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(contentRef.current)
      .save()
      .catch((err: any) => console.error("PDF generation failed:", err));
  };

  if (!isClient) return null;

  return (
    <button
      onClick={handleDownloadPDF}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
      disabled={!html2pdf}
    >
      {html2pdf ? buttonText : "Loading PDF converter..."}
    </button>
  );
}
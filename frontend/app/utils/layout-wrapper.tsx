// app/components/layout-wrapper.tsx
export function LayoutWrapper({ children }) {
  return (
    <div className="pt-10 md:pt-10 min-h-screen"> {/* 모바일/데스크탑 별 높이 조정 */}
      {/* <div className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6"> 반응형 패딩 */}
        {children}
      {/* </div> */}
    </div>
  );
}
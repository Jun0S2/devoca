// app/components/layout-wrapper.tsx
export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-[7vh] min-h-screen">
      <main className="h-[calc(100vh-7vh)] overflow-auto">
        {children}
      </main>
    </div>
  );
}
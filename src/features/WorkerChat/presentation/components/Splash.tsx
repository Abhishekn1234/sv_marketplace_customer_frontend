export function Splash({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-[#F1EFE8]">
      <div className="rounded-xl border border-red-100 bg-white px-5 py-4 text-red-500 shadow">
        {children}
      </div>
    </div>
  );
}
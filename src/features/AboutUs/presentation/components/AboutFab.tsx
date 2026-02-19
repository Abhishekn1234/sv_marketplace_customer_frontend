export default function AboutFab() {
  return (
    <button
      className="
        fixed bottom-6 right-6 z-[100]
        w-14 h-14
        bg-blue-600
        rounded-full
        flex items-center justify-center
        shadow-[0_4px_16px_rgba(37,99,235,0.4)]
        transition-all duration-300
        ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:scale-110 hover:rotate-90
        hover:shadow-[0_8px_24px_rgba(37,99,235,0.5)]
        active:scale-95
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 fill-white transition-transform duration-300"
      >
        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" />
      </svg>
    </button>
  );
}

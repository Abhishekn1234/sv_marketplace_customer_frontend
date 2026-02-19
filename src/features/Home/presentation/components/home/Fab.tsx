

export default function Fab() {
  return (
    <button
      aria-label="Add new"
      className="
        fixed bottom-4 right-4 
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
        bg-blue-600 rounded-full 
        flex items-center justify-center
        shadow-lg z-50
        
        transform transition-all duration-300 ease-in-out
        hover:scale-110 hover:rotate-90 hover:shadow-2xl
        active:scale-95
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="
          w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 
          fill-white transition-transform duration-300 ease-in-out
        "
      >
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    </button>
  );
}

export default function CommonFaq(){
    return(
    <>
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-90 active:scale-95 transition-all duration-300 z-50"
        aria-label="Add new"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-white transition-transform duration-300"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>
    </>

    )
}
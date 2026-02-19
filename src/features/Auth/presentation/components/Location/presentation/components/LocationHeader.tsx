export default function LocationHeader() {
  return (
    <div className="mt-2 flex flex-col items-center text-center px-4">
      <h1
        className="
          text-[32px] sm:text-[36px] lg:text-[42px]
          font-bold text-gray-900
          tracking-[-0.02em]
          leading-[1.2]
          mb-4
        "
      >
        Where do you{" "}
        <span className="text-blue-600">need us?</span>
      </h1>

      <p
        className="
          text-[16px] sm:text-[17px] lg:text-[18px]
          text-gray-500
          leading-[1.6]
          mb-2
          max-w-xl
        "
      >
        Enter your location to discover expert services and cleaning teams
        available in your neighborhood.
      </p>
    </div>
  );
}

import Button from "@/components/input/Button";
import CommonCard from "@/components/common/CommonCards";

export default function PromoCards() {
  return (
    <CommonCard
      className="
        relative
        bg-gradient-to-br from-indigo-600 to-purple-600
        text-white overflow-hidden
        hover:-translate-y-0.5 hover:shadow-2xl
        transition-transform duration-300
      "
    >
      {/* Shimmer / Radial effect */}
      <span className="absolute top-[-50%] right-[-50%] w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Badge */}
      <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wide rounded-full bg-white/20 backdrop-blur-sm border border-white/10">
        New
      </span>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-2 relative z-10">
        Get 20% Off
      </h3>

      {/* Description */}
      <p className="text-sm text-white/85 mb-5 leading-relaxed relative z-10">
        On your first plumbing service booking.
      </p>

      {/* Button */}
      <Button
        variant="none"
        className="
          w-full h-12
          bg-white text-indigo-600 font-semibold
          rounded-lg
          transition-all duration-200
          relative z-10
          hover:-translate-y-0.5 hover:shadow-lg
          active:translate-y-0
        "
      >
        Claim Offer
      </Button>
    </CommonCard>
  );
}

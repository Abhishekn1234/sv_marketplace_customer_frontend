"use client";

interface CommonSpinnerProps {
  size?: number;
  className?: string;
  center?: boolean;

  color?:
    | "slate"
    | "gray"
    | "zinc"
    | "neutral"
    | "stone"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "rose"
    | "black"
    | "white";
}

export default function CommonSpinner({
  size = 40,
  className = "",
  color = "blue",
  center = false,
}: CommonSpinnerProps) {
  const colorClasses = {
    slate: "border-slate-600",
    gray: "border-gray-600",
    zinc: "border-zinc-600",
    neutral: "border-neutral-600",
    stone: "border-stone-600",

    red: "border-red-600",
    orange: "border-orange-600",
    amber: "border-amber-500",
    yellow: "border-yellow-500",
    lime: "border-lime-600",

    green: "border-green-600",
    emerald: "border-emerald-600",
    teal: "border-teal-600",
    cyan: "border-cyan-600",
    sky: "border-sky-600",

    blue: "border-blue-600",
    indigo: "border-indigo-600",
    violet: "border-violet-600",
    purple: "border-purple-600",
    fuchsia: "border-fuchsia-600",

    pink: "border-pink-600",
    rose: "border-rose-600",

    black: "border-black",
    white: "border-white",
  };

  const spinner = (
    <div
      className={`
        animate-spin
        rounded-full
        border-[3px]
        border-t-transparent
        ${colorClasses[color]}
        ${className}
      `}
      style={{ width: size, height: size }}
    />
  );

 if (center) {
  return (
    <div className="flex items-center justify-center w-full">
      {spinner}
    </div>
  );
}

  return spinner;
}
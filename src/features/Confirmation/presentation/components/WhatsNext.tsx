"use client";
import NextStep from "./Nextstep";

export default function WhatsNext() {
  const steps = [
    { number: "1", title: "Provider Assignment", description: "We'll match you with a top-rated professional" },
    { number: "2", title: "Confirmation Call", description: "Your provider will contact you" },
    { number: "3", title: "Service Delivery", description: "Enjoy professional service at your scheduled time" },
  ];

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left">
      <h3 className="text-xs font-bold uppercase text-gray-400 mb-5">What's Next?</h3>
      <div className="flex flex-col gap-4">
        {steps.map(step => (
          <NextStep key={step.number} {...step} />
        ))}
      </div>
    </div>
  );
}
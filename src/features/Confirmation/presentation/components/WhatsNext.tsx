"use client";
import { useLanguage } from "@/features/context/LanguageContext";
import NextStep from "./Nextstep";

export default function WhatsNext() {
  const {t}=useLanguage();
 const steps = [
  {
    number: "1",
    title: t.confirmationpage.steps.step1.title,
    description: t.confirmationpage.steps.step1.description,
  },
  {
    number: "2",
    title: t.confirmationpage.steps.step2.title,
    description: t.confirmationpage.steps.step2.description,
  },
  {
    number: "3",
    title: t.confirmationpage.steps.step3.title,
    description: t.confirmationpage.steps.step3.description,
  },
];

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-5">
          {t.confirmationpage.whatsNext}
        </h3>
      <div className="flex flex-col gap-4">
        {steps.map(step => (
          <NextStep key={step.number} {...step} />
        ))}
      </div>
    </div>
  );
}
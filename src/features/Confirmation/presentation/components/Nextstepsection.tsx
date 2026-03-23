import NextStep from "./Nextstep";

export default function NextStepsSection() {
  return (
    <div className="bg-white border rounded-xl p-6">
      <NextStep number="1" title="Provider Assignment" />
      <NextStep number="2" title="Confirmation Call" />
      <NextStep number="3" title="Service Delivery" />
    </div>
  );
}
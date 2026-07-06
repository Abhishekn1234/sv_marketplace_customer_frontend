import { PhoneIcon, UserRoundIcon } from "@/components/icons";

export function BookingHistoryCallableContact({
  name,
  phone,
}: {
  name: string;
  phone?: string | null;
}) {
  if (!phone) {
    return (
      <span className="flex items-center gap-1.5 text-sm text-gray-500">
        <UserRoundIcon className="h-4 w-4 text-gray-400" />
        {name}
      </span>
    );
  }

  return (
    <a
      href={`tel:${phone}`}
      title={`Call ${name}`}
      className="group flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-blue-700"
    >
      <UserRoundIcon className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
      <span className="underline decoration-transparent underline-offset-2 transition-colors group-hover:decoration-blue-300">
        {name}
      </span>
      <PhoneIcon className="h-3.5 w-3.5 -translate-x-1 text-blue-600 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
    </a>
  );
}
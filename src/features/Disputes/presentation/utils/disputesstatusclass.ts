export function statusClass(status: string) {
  const map: Record<string, string> = {
    open: "bg-amber-50 text-amber-800 border-amber-200",
    pending: "bg-blue-50 text-blue-800 border-blue-200",
    resolved: "bg-green-50 text-green-800 border-green-200",
    closed: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
}
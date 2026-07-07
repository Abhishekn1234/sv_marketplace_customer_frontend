export function formatText(text?: string): string {
  if (!text) return "";

  return text
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
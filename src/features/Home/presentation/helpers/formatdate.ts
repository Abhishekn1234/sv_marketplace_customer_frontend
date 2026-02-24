export const formatDate = (dateString?: string) => {
  if (!dateString) return "—";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
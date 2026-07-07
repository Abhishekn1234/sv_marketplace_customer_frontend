export const formatDate = (
  dateString?: string,
  t?: any
) => {
  const date = dateString ? new Date(dateString) : new Date();

  return date.toLocaleDateString(
    t?.securitypage?.locale || "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};
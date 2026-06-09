export const getKey = (n: any, index: number) => {
  return (
    n?.id ||
    n?._id ||
    n?.createdAt + "-" + n?.title ||
    `fallback-${index}`
  );
};
export function formatWorkHours(decimalHours: number) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} min`;
  }

  if (hours > 0) {
    return `${hours} hr`;
  }

  return `${minutes} min`;
}
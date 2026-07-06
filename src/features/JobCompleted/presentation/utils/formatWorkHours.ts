// export const formatWorkHours = (hours: number) => {
//   const totalSeconds = Math.round(hours * 3600);

//   const hrs = Math.floor(totalSeconds / 3600);
//   const mins = Math.floor((totalSeconds % 3600) / 60);
//   const secs = totalSeconds % 60;

//   const parts: string[] = [];

//   if (hrs > 0) {
//     parts.push(`${hrs} ${hrs === 1 ? "hr" : "hrs"}`);
//   }

//   if (mins > 0) {
//     parts.push(`${mins} ${mins === 1 ? "min" : "mins"}`);
//   }

//   if (secs > 0 || parts.length === 0) {
//     parts.push(`${secs} ${secs === 1 ? "sec" : "secs"}`);
//   }

//   return parts.join(" ");
// };
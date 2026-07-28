export interface JobProgressTask {
  title: string;
  activityType: string;
  status: "completed" | "progress" | "cancelled";
  time: string;
}
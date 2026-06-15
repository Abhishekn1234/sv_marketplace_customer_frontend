type IssueType =
  | "WORK_NOT_COMPLETED"
  | "BAD_WORKER_BEHAVIOUR"
  | "BAD_CUSTOMER_BEHAVIOUR"
  | "BAD_SERVICE"
  | "REFUND_REQUEST"
  | "OTHER";

const options: { value: IssueType; label: string }[] = [
  { value: "WORK_NOT_COMPLETED", label: "Work Not Completed" },
  { value: "BAD_WORKER_BEHAVIOUR", label: "Bad Worker Behaviour" },
  { value: "BAD_CUSTOMER_BEHAVIOUR", label: "Bad Customer Behaviour" },
  { value: "BAD_SERVICE", label: "Bad Service" },
  { value: "REFUND_REQUEST", label: "Refund Request" },
  { value: "OTHER", label: "Other" },
];

export { options, type IssueType };
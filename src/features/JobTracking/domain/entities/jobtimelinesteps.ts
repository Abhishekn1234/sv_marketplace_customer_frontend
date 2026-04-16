export type Step = {
  title: string;
  time: string;
  status: "completed" | "pending" | "active";
  key: string;
  showPaymentButton?: boolean;
  showVerifyButton?: boolean;
  showServiceRatingButton?: boolean;
};
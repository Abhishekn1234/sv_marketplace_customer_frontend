export type PaymentMethodType =
  | "CARD"
  | "APPLE_PAY"
  | "CASH"
  | "STC"
  | "MADA"
  | "BANK"
  | "STRIPE";

export const getMethodMeta = (
  paymentMethods: any
): Record<
  PaymentMethodType,
  {
    label: string;
    icon: string;
    bg: string;
    color: string;
  }
> => {
  const cardLabel = paymentMethods.creditCard;

  return {
    CARD: {
      label: cardLabel.toLowerCase().startsWith("stripe")
        ? "Stripe"
        : cardLabel,
      icon: "💳",
      bg: "#EFF6FF",
      color: "#1D4ED8",
    },

    STRIPE: {
      label: paymentMethods.stripe ?? "Stripe",
      icon: "💳",
      bg: "#EEF2FF",
      color: "#4338CA",
    },

    APPLE_PAY: {
      label: paymentMethods.applePay ?? "Apple Pay",
      icon: "🍎",
      bg: "#F3F4F6",
      color: "#111827",
    },

    CASH: {
      label: paymentMethods.cash ?? "Cash",
      icon: "💵",
      bg: "#ECFDF5",
      color: "#059669",
    },

    STC: {
      label: paymentMethods.stcPay ?? "STC Pay",
      icon: "📱",
      bg: "#FEF3C7",
      color: "#92400E",
    },

    MADA: {
      label: paymentMethods.mada ?? "Mada",
      icon: "🏧",
      bg: "#FDF2F8",
      color: "#9D174D",
    },

    BANK: {
      label: paymentMethods.bankTransfer ?? "Bank Transfer",
      icon: "🏦",
      bg: "#F5F3FF",
      color: "#6D28D9",
    },
  };
};
export const SHOWS_CARD_FIELDS = [ "CARD", "STRIPE", "MADA", ];
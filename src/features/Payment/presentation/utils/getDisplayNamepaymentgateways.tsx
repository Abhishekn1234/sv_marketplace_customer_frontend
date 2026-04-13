export const getDisplayName = (type: string) => {
  switch (type) {
    case "CARD":
      return "Card";
    case "UPI":
      return "UPI";
    case "CASH":
      return "Cash";
    case "WALLET":
      return "Wallet";
    case "NET_BANKING":
      return "Net Banking";
    default:
      return type;
  }
};
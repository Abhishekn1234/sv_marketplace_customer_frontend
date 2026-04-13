import { Banknote, CreditCard, Smartphone } from "lucide-react";

export const getIcon = (type: string) => {
  switch (type) {
    case "CARD":
      return <CreditCard size={28} />;
    case "UPI":
      return <Smartphone size={28} />;
    case "CASH":
      return <Banknote size={28} />;
    case "WALLET":
      return <Smartphone size={28} />;
    case "NET_BANKING":
      return <CreditCard size={28} />;
    default:
      return <CreditCard size={28} />;
  }
};
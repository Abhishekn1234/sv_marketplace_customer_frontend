import { BanknoteIcon, CreditCardIcon, SmartphoneIcon } from "@/components/icons";

export const getIcon = (type: string) => {
  switch (type) {
    case "CARD":
      return <CreditCardIcon size={28} />;
  
    case "UPI":
      return <SmartphoneIcon size={28} />;
    case "CASH":
      return <BanknoteIcon size={28} />;
    case "WALLET":
      return <SmartphoneIcon size={28} />;
    case "NET_BANKING":
      return <CreditCardIcon size={28} />;
    default:
      return <CreditCardIcon size={28} />;
  }
};
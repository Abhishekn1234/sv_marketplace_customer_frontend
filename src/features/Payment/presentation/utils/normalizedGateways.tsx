import type { PaymentGateway } from "../../domain/entities/paymentgatewaygetresponse";

export const normalizeGateways = (
  gateways: PaymentGateway[] = []
): PaymentGateway[] => {
  const seen = new Set<string>();

  const order = ["UPI", "CARD", "NET_BANKING", "WALLET", "CASH"];

  return gateways
    .filter((g) => {
      if (!g?.type) return false;

      if (seen.has(g.type)) return false;

      seen.add(g.type);
      return true;
    })
    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
};
export interface PaymentGateway {
  id: string;
  type: string;
  title: string;
  publicKey?:string;
}
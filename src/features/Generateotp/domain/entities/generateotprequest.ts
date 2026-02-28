export interface GenerateotpRequest{
  bookingId: string;
  purpose:string;
  otp?:number| string;
}
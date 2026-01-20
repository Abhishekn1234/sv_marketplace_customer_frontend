
export interface OTPResponse {
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  user?:any;
  verified?:boolean;

}
import type { SendOtpMobile } from "../entities/sendotpmobile";

export interface SendOtpMobileRepo {
  sendOtpMobile(data: SendOtpMobile): Promise<{ message: string }>;
}

import { useState } from "react";
import type { SendOtpMobile } from "../../domain/entities/sendotpmobile";
import { toast } from "react-toastify";
import { SendOtpMobileRepoImpl } from "../../data/repositories/SendOtpMobile";
import type { SendOtpMobileRepo } from "../../domain/repositories/SendOtpMobileRepo";
import { handleApiError } from "@/components/common/ApiError";


export const useSendOtpMobile = () => {
  const [loading, setLoading] = useState(false);

  const sendOtpMobile = async (data: SendOtpMobile) => {
    setLoading(true);
    try {
      const repo: SendOtpMobileRepo = new SendOtpMobileRepoImpl(); 
      const res = await repo.sendOtpMobile(data);
      toast.success("OTP sent successfully");
      return res;
    } catch (err: any) {
     handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtpMobile, loading };
};
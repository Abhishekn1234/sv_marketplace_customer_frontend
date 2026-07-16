
import apiClient from "@/features/api/interceptor";
import { ValidateCouponRequest, ValidateCouponResponse } from "@/features/BookingDetail/domain/entities/couponValidation.types";
import { CouponValidationRepository } from "@/features/BookingDetail/domain/repositories/CouponCodeRepo";

export class CouponValidationRepositoryImpl
  implements CouponValidationRepository
{
  async validateCoupon(
    data: ValidateCouponRequest
  ): Promise<ValidateCouponResponse> {
    const response = await apiClient.post<ValidateCouponResponse>(
      "/booking/coupon/validate",
      data
    );

    return response.data;
  }
}
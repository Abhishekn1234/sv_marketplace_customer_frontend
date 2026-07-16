import {
  ValidateCouponRequest,
  ValidateCouponResponse,
} from "../entities/couponValidation.types";

export interface CouponValidationRepository {
  validateCoupon(
    data: ValidateCouponRequest
  ): Promise<ValidateCouponResponse>;
}
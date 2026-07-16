import { ValidateCouponRequest, ValidateCouponResponse } from "../entities/couponValidation.types";
import { CouponValidationRepository } from "../repositories/CouponCodeRepo";

export class ValidateCouponUseCase {
  constructor(
    private repository: CouponValidationRepository
  ) {}

  execute(
    data: ValidateCouponRequest
  ): Promise<ValidateCouponResponse> {
    return this.repository.validateCoupon(data);
  }
}
import { useMutation } from "@tanstack/react-query";
import { CouponValidationRepositoryImpl } from "../../data/repositories/couponcode/CouponCodeRepoImpl";
import { ValidateCouponUseCase } from "../../domain/usecase/ApplyCouponCodeUsecase";

const repository = new CouponValidationRepositoryImpl();
const useCase = new ValidateCouponUseCase(repository);

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: useCase.execute.bind(useCase),
  });
};
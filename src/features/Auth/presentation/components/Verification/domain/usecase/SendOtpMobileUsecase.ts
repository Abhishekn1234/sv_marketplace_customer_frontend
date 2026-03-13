import type { SendOtpMobile } from "../entities/sendotpmobile";
import type { SendOtpMobileRepo } from "../repositories/SendOtpMobileRepo";
export class SendOtpMobileUseCase {
  private repo: SendOtpMobileRepo;

  constructor(repo: SendOtpMobileRepo) {
    this.repo = repo;
  }

  execute(data: SendOtpMobile) {
    return this.repo.sendOtpMobile(data);
  }
}
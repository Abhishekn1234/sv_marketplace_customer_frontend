import type { Profile } from "../entities/profile";
import type { ProfileRepo } from "../repositories/ProfileRepo";

export class GetProfileUsecase {
  private repo: ProfileRepo;

  constructor(repo: ProfileRepo) {
    this.repo = repo;
  }

  async execute(): Promise<Profile> {
    return await this.repo.getProfile();
  }
}

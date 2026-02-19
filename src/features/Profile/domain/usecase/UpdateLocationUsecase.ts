import type { Location } from "../entities/location";
import type { ProfileRepo } from "../repositories/ProfileRepo";

export class UpdateLocationUsecase {
  private profileRepo: ProfileRepo;

  constructor(profileRepo: ProfileRepo) {
    this.profileRepo = profileRepo;
  }

  async execute(id: string, data: Partial<Location>): Promise<Location> {
    return this.profileRepo.updateLocation(id,data);
  }
}

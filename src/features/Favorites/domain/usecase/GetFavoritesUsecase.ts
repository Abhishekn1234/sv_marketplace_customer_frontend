import { FavoriteServiceRepo } from "../repositories/FavoriteRepo";


export class GetFavoriteStatusUsecase {
  constructor(private repo: FavoriteServiceRepo) {}

  execute(serviceId: string) {
    return this.repo.getFavoriteStatus(serviceId);
  }
}
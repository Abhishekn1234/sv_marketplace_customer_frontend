import { FavoriteServiceRepo } from "../repositories/FavoriteRepo";


export class RemoveFavoriteServiceUsecase {
  constructor(private repo: FavoriteServiceRepo) {}

  execute(serviceId: string) {
    return this.repo.removeFavorite(serviceId);
  }
}

import type { ProfileRepo } from "../repositories/ProfileRepo";


export class UpdateProfileUsecase{
  private updateprofilerepo:ProfileRepo;
  constructor(updateprofile:ProfileRepo){
    this.updateprofilerepo=updateprofile
  }

  async execute(data:FormData){
    return this.updateprofilerepo.updateProfile(data)
  }
    
}
import type  { IProfileRepository } from '../../repositories/IProfileRepository';
import type { GetProfileResponse } from '../../entities/getprofileresponse.types';

export class GetProfileUseCase {
  private profileRepository: IProfileRepository;
  constructor(profilerepo:IProfileRepository){
    this.profileRepository=profilerepo;
  }

  async execute(): Promise<GetProfileResponse> {
    
    return await this.profileRepository.getProfile();
  }
}

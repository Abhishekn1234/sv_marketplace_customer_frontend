import type  { IProfileRepository } from '../../repositories/IProfileRepository';
import type { GetProfileResponse } from '../../entities/profile.types';

export class GetProfileUseCase {
  private profileRepository: IProfileRepository;
  constructor(profilerepo:IProfileRepository){
    this.profileRepository=profilerepo;
  }

  async execute(): Promise<GetProfileResponse> {
    // Execute get profile
    return await this.profileRepository.getProfile();
  }
}

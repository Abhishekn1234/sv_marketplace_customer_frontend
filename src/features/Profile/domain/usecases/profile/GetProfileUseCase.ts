import type  { IProfileRepository } from '../../repositories/IProfileRepository';
import type { GetProfileResponse } from '../../features/types/profile.types';

export class GetProfileUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(): Promise<GetProfileResponse> {
    // Execute get profile
    return await this.profileRepository.getProfile();
  }
}

import type { IProfileRepository } from '../../repositories/IProfileRepository';
import { validateUpdatePassword } from '../../validations/updateprofilevalidation';

export class UpdatePasswordUseCase {
  private profileRepository: IProfileRepository;
    constructor(profilerepo:IProfileRepository){
      this.profileRepository=profilerepo;
    }
  async execute(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
 
   validateUpdatePassword(
      oldPassword,
      newPassword,
      confirmPassword
    );

    return this.profileRepository.updatePassword(
      oldPassword,
      newPassword
    );
  }
}

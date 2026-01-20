import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type { ResetPasswordRequest } from '../../entities/resetpasswordrequest.types';

export class ResetPasswordUseCase {
  private authRepository: IAuthRepository;
    constructor(authrepo:IAuthRepository){
      this.authRepository=authrepo;
    }
  async execute(request: ResetPasswordRequest): Promise<{ message: string }> {
  
    if (!request.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
      throw new Error('Valid email is required');
    }


    if (!request.password || request.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }


    return await this.authRepository.resetPassword(request);
  }
}

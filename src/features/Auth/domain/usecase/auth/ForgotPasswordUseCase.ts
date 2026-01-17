import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type { ForgotPasswordRequest } from '../../entities/auth.types';

export class ForgotPasswordUseCase {
 private authRepository: IAuthRepository;
   constructor(authrepo:IAuthRepository){
     this.authRepository=authrepo;
   }
  async execute(request: ForgotPasswordRequest): Promise<{ message: string }> {
    // Validation
    if (!request.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
      throw new Error('Valid email is required');
    }

    // Execute forgot password
    return await this.authRepository.forgotPassword(request);
  }
}

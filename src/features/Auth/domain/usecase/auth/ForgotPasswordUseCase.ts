import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type { ForgotPasswordRequest } from '../../entities/forgotpasswordrequest';
import { validateForgotPassword } from '../../validations/authvalidation';
export class ForgotPasswordUseCase {
 private authRepository: IAuthRepository;
   constructor(authrepo:IAuthRepository){
     this.authRepository=authrepo;
   }
  async execute(request: ForgotPasswordRequest): Promise<{ message: string }> {
   
    const payload = validateForgotPassword(request);

   
    return await this.authRepository.forgotPassword(payload);
  }
}

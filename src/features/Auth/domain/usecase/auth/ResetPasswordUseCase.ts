import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type { ResetPasswordRequest } from '../../entities/resetpasswordrequest.types';
import { validateEmail, validatePassword } from '../../validations/authvalidation';

export class ResetPasswordUseCase {
  private authRepository: IAuthRepository;
    constructor(authrepo:IAuthRepository){
      this.authRepository=authrepo;
    }
  async execute(
    request: ResetPasswordRequest
  ): Promise<{ message: string }> {
    const payload: ResetPasswordRequest = {
      ...request,
      email: validateEmail(request.email),
      password: validatePassword(request.password),
    };

    return this.authRepository.resetPassword(payload);
  }
}

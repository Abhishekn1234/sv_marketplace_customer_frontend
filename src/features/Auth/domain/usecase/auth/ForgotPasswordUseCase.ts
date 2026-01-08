import type { IAuthRepository } from '../../Auth/domain/repositories/IAuthRepository';
import type { ForgotPasswordRequest } from '../../features/types/auth.types';

export class ForgotPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(request: ForgotPasswordRequest): Promise<{ message: string }> {
    // Validation
    if (!request.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
      throw new Error('Valid email is required');
    }

    // Execute forgot password
    return await this.authRepository.forgotPassword(request);
  }
}

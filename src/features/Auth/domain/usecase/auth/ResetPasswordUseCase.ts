import type { IAuthRepository } from '../../Auth/domain/repositories/IAuthRepository';
import type { ResetPasswordRequest } from '../../features/types/auth.types';

export class ResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(request: ResetPasswordRequest): Promise<{ message: string }> {
    // Email validation
    if (!request.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
      throw new Error('Valid email is required');
    }

    // Password validation
    if (!request.password || request.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Execute reset password
    return await this.authRepository.resetPassword(request);
  }
}

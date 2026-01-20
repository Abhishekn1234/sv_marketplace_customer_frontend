import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type {  RegisterResponse } from '../../entities/registerresponse.types';
import type { RegisterRequest } from '../../entities/registerrequest';
export class RegisterUseCase {
  private authRepository: IAuthRepository;
  constructor(authrepo:IAuthRepository){
    this.authRepository=authrepo;
  }
  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    // Normalize input
    const payload: RegisterRequest = {
      fullName: request.fullName?.trim(),
      email: request.email?.trim().toLowerCase(),
      phone: request.phone?.trim(),
      password: request.password,
    };

    // Validation
    if (!payload.fullName || payload.fullName.length < 2) {
      throw new Error('Full name must be at least 2 characters');
    }

    if (
      !payload.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
    ) {
      throw new Error('Valid email is required');
    }

    if (!payload.phone || payload.phone.length < 10) {
      throw new Error('Valid phone number is required');
    }

    if (!payload.password || payload.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Optional: password strength (safe default)
    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
        payload.password
      )
    ) {
      throw new Error(
        'Password must contain uppercase, lowercase, number and special character'
      );
    }

    // Execute registration
    return this.authRepository.register(payload);
  }
}


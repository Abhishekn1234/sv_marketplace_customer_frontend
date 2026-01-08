import type { IAuthRepository } from "../../Auth/domain/repositories/IAuthRepository";
import type { LoginRequest, LoginResponse } from "../../features/types/auth.types";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    // ✅ Validation
    if (!request.password) {
      throw new Error("Password is required");
    }

    if (!request.email && !request.phone) {
      throw new Error("Email or phone is required");
    }

    // ✅ Execute login
    const response = await this.authRepository.login(request);

    

    return response;
  }
}


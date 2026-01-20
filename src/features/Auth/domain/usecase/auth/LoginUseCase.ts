import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type {  LoginResponse } from "../../entities/loginresponse.types";
import type { LoginRequest } from '../../entities/loginrequest.types';
export class LoginUseCase {
  private authRepository: IAuthRepository;
  constructor(authrepo:IAuthRepository){
    this.authRepository=authrepo;
  }
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


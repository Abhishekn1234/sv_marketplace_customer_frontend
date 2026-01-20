import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type {  LoginResponse } from "../../entities/loginresponse.types";
import type { LoginRequest } from '../../entities/loginrequest.types';
import { validateEmail, validatePassword, validatePhone } from '../../validations/authvalidation';
export class LoginUseCase {
  private authRepository: IAuthRepository;
  constructor(authrepo:IAuthRepository){
    this.authRepository=authrepo;
  }
  async execute(request: LoginRequest): Promise<LoginResponse> {
    
    if (!validatePassword(request.password)) {
      throw new Error("Password is required");
    }

    if (!validateEmail(request.email) && !validatePhone(request.phone)) {
      throw new Error("Email or phone is required");
    }

    
    const response = await this.authRepository.login(request);

    

    return response;
  }
}


import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type {  RegisterResponse } from '../../entities/registerresponse.types';
import type { RegisterRequest } from '../../entities/registerrequest';
import { validateRegister } from '../../validations/authvalidation';
export class RegisterUseCase {
  private authRepository: IAuthRepository;
  constructor(authrepo:IAuthRepository){
    this.authRepository=authrepo;
  }
  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    
    const payload=validateRegister(request);

   
    return this.authRepository.register(payload);
  }
}


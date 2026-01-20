import type { IAuthRepository } from '../../repositories/IAuthRepository';
import { useAuthStore } from '../../../../core/store/auth';

export class LogoutUseCase {
  private authRepository: IAuthRepository;
  constructor(authrepo:IAuthRepository){
    this.authRepository=authrepo;
  }

  async execute(): Promise<void> {
  
    await this.authRepository.logout();

   
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
  }
}

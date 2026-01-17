import type { IAuthRepository } from '../../repositories/IAuthRepository';
import { useAuthStore } from '../../../../core/store/auth';

export class LogoutUseCase {
  private authRepository: IAuthRepository;
  constructor(authrepo:IAuthRepository){
    this.authRepository=authrepo;
  }

  async execute(): Promise<void> {
    // Execute logout API call
    await this.authRepository.logout();

    // Clear Zustand auth store instead of localStorage
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
  }
}

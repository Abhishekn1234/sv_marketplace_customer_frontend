import type { IProfileRepository } from '../../repositories/IProfileRepository';

export class UpdatePasswordUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
    // ✅ frontend validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new Error('All fields are required');
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return this.profileRepository.updatePassword(
      oldPassword,
      newPassword
    );
  }
}

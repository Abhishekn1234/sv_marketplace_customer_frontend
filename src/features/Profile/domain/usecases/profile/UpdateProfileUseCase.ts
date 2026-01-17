import type { IProfileRepository } from '../../repositories/IProfileRepository';
import type { UpdateProfileResponse } from '../../entities/profile.types';

type UpdateProfileWithFiles = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: File;
  idProof?: File;
  addressProof?: File;
  photoProof?: File;
};

export class UpdateProfileUseCase {
private profileRepository: IProfileRepository;
constructor(profilerepo:IProfileRepository){
  this.profileRepository=profilerepo;
}

  async execute(
    request: UpdateProfileWithFiles
  ): Promise<UpdateProfileResponse> {

    // ✅ Validation (JSON-friendly)
    if (request.fullName && request.fullName.trim().length < 2) {
      throw new Error('Full name must be at least 2 characters');
    }

    if (
      request.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)
    ) {
      throw new Error('Invalid email format');
    }

    if (request.phone && request.phone.trim().length < 10) {
      throw new Error('Invalid phone number');
    }

    if (request.address && request.address.trim().length < 10) {
      throw new Error('Address must be at least 10 characters');
    }

    // ✅ Build FormData AFTER validation
    const formData = new FormData();

    if (request.fullName) formData.append('fullName', request.fullName);
    if (request.email) formData.append('email', request.email);
    if (request.phone) formData.append('phone', request.phone);
    if (request.address) formData.append('address', request.address);

    if (request.profileImage)
      formData.append('profileImage', request.profileImage);
    if (request.idProof)
      formData.append('idProof', request.idProof);
    if (request.addressProof)
      formData.append('addressProof', request.addressProof);
    if (request.photoProof)
      formData.append('photoProof', request.photoProof);

    // ✅ Repository ONLY receives FormData
    return this.profileRepository.updateProfile(formData);
  }
}


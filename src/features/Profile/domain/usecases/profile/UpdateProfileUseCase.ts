import type { IProfileRepository } from '../../repositories/IProfileRepository';
import type { UpdateProfileResponse } from '../../entities/updateprofileresponse.types';
import type { UpdateProfileWithFiles } from '../../entities/updateprofilewithfiles.types';
import { validateUpdateProfile } from '../../validations/updateprofilevalidation';


export class UpdateProfileUseCase {
private profileRepository: IProfileRepository;
constructor(profilerepo:IProfileRepository){
  this.profileRepository=profilerepo;
}

  async execute(
    request: UpdateProfileWithFiles
  ): Promise<UpdateProfileResponse> {

   
    validateUpdateProfile(request);
   
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

  
    return this.profileRepository.updateProfile(formData);
  }
}


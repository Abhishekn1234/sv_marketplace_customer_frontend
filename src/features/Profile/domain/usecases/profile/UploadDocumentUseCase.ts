import type { IProfileRepository } from '../../repositories/IProfileRepository';
import type { UploadDocumentResponse } from '../../entities/uploaddocumentresponse.types';
import type { UploadDocumentRequest } from '../../entities/uploaddocumentrequest.types';
export class UploadDocumentUseCase {
  private profileRepository: IProfileRepository;
    constructor(profilerepo:IProfileRepository){
      this.profileRepository=profilerepo;
    }
  async execute(request: UploadDocumentRequest): Promise<UploadDocumentResponse> {
    
    if (!request.file) {
      throw new Error('File is required');
    }

    if (!request.documentType) {
      throw new Error('Document type is required');
    }

    
    const maxSize = 5 * 1024 * 1024; 
    if (request.file.size > maxSize) {
      throw new Error('File size must not exceed 5MB');
    }


    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(request.file.type)) {
      throw new Error('Invalid file type. Allowed: JPG, PNG, GIF, PDF');
    }

    
    return await this.profileRepository.uploadDocument(request);
  }
}

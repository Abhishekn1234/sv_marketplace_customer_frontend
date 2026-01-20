import type { IProfileRepository } from '../../repositories/IProfileRepository';
import type { UploadDocumentResponse } from '../../entities/uploaddocumentresponse.types';
import type { UploadDocumentRequest } from '../../entities/uploaddocumentrequest.types';
import { validateUploadDocument } from '../../validations/updateprofilevalidation';
export class UploadDocumentUseCase {
  private profileRepository: IProfileRepository;
    constructor(profilerepo:IProfileRepository){
      this.profileRepository=profilerepo;
    }
  async execute(request: UploadDocumentRequest): Promise<UploadDocumentResponse> {
    
    validateUploadDocument(request);
    
    return await this.profileRepository.uploadDocument(request);
  }
}

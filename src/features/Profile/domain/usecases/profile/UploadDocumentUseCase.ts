import type { IProfileRepository } from '../../repositories/IProfileRepository';
import type { UploadDocumentRequest, UploadDocumentResponse } from '../../features/types/profile.types';

export class UploadDocumentUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(request: UploadDocumentRequest): Promise<UploadDocumentResponse> {
    // Validation
    if (!request.file) {
      throw new Error('File is required');
    }

    if (!request.documentType) {
      throw new Error('Document type is required');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (request.file.size > maxSize) {
      throw new Error('File size must not exceed 5MB');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(request.file.type)) {
      throw new Error('Invalid file type. Allowed: JPG, PNG, GIF, PDF');
    }

    // Execute upload document
    return await this.profileRepository.uploadDocument(request);
  }
}

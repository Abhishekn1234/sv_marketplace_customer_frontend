import type { DocumentType } from "./documenttypes";

export interface UploadDocumentRequest {
  documentType: DocumentType;
  file: File;
}
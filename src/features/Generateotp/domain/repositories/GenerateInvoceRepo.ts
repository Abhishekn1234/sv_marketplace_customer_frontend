import type { GenerateInvoice } from "../entities/generateinvoice";

export interface GenerateInvoiceRepo {
  generateInvoice(data: GenerateInvoice): Promise<GenerateInvoice>;
}
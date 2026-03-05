import type { GenerateInvoice } from "../entities/generateinvoice";
import type { GenerateInvoiceRepo } from "../repositories/GenerateInvoceRepo";

export class GenerateInvoiceRepoUsecase {
  private generateInvoiceRepo: GenerateInvoiceRepo;

  constructor(generateInvoice: GenerateInvoiceRepo) {
    this.generateInvoiceRepo = generateInvoice;
  }

  async execute(data: GenerateInvoice): Promise<GenerateInvoice> {
    return this.generateInvoiceRepo.generateInvoice(data);
  }
}
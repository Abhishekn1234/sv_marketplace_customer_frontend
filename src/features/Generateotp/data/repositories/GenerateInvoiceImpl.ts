import type { GenerateInvoice } from "../../domain/entities/generateinvoice";
import type { GenerateInvoiceRepo } from "../../domain/repositories/GenerateInvoceRepo";
import apiClient from "@/features/api/interceptor";

export class GenerateInvoiceImpl implements GenerateInvoiceRepo {
  async generateInvoice(data: GenerateInvoice): Promise<GenerateInvoice> {
    try {
      const response = await apiClient.get(`/booking/invoice/${data.bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
  }
}
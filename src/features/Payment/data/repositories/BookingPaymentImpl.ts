import apiClient from "@/features/api/interceptor";
import type { PaymentInitial } from "../../domain/entities/intiatepayment";
import type { BookingPaymentRepo } from "../../domain/repositories/BookingPaymentRepo";

export class BookingPaymentImpl implements BookingPaymentRepo{
    async payment(data: PaymentInitial): Promise<any> {
        const response=await apiClient.post('/booking/payment',data);
        return response.data;
    }
}
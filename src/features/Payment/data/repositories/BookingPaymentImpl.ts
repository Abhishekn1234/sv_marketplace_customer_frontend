import apiClient from "@/features/api/interceptor";
import type {
    PaymentInitial,
    PaymentInitiationResponse,
} from "../../domain/entities/intiatepayment";
import type { ProcessingPaymentSession } from "../../domain/entities/processingpaymentsession";
import type { BookingPaymentRepo } from "../../domain/repositories/BookingPaymentRepo";

export class BookingPaymentImpl implements BookingPaymentRepo{
    async payment(data: PaymentInitial): Promise<PaymentInitiationResponse> {
        const response=await apiClient.post('/booking/payment',data);
        return response.data;
    }

    async getProcessingPaymentSession(
        bookingId: string
    ): Promise<ProcessingPaymentSession | null> {
        const response = await apiClient.get(
            `/booking/payment/session/${bookingId}`,
            {
                validateStatus: (status) =>
                    (status >= 200 && status < 300) || status === 404,
            }
        );

        if (response.status === 404) {
            return null;
        }

        const payload = response.data;
        return (
            payload?.data ??
            payload?.paymentSession ??
            payload?.session ??
            payload
        );
    }
}

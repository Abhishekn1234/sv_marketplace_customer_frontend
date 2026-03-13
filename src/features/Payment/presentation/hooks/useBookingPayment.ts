import { useMutation } from "@tanstack/react-query";
import { BookingPaymentImpl } from "../../data/repositories/BookingPaymentImpl";
import { BookingPaymentUsecase } from "../../domain/usecase/BookingPaymentUsecase";
import type { PaymentInitial } from "../../domain/entities/intiatepayment";

export function useBookingPayment(){
    const repo=new BookingPaymentImpl();
    const usecase=new BookingPaymentUsecase(repo);

    return useMutation({
        mutationFn:(data:PaymentInitial)=>usecase.execute(data),
        mutationKey:["bookingpayment"]
    })
}

import { LocalizedText } from "@/components/common/localizedtext.types";
import { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";


export const statusMessageMap: Partial<Record<BookingStatus, LocalizedText>> = {
  [BookingStatus.REQUESTED]: {
    en: "Your booking request has been submitted and is waiting for a worker to accept.",
    ar: "تم إرسال طلب الحجز الخاص بك وهو في انتظار قبول العامل.",
    hi: "आपका बुकिंग अनुरोध भेज दिया गया है और कर्मचारी की स्वीकृति की प्रतीक्षा कर रहा है।",
  },

  [BookingStatus.WORKER_ACCEPTED]: {
    en: "A worker has accepted your booking.",
    ar: "قام أحد العمال بقبول حجزك.",
    hi: "एक कर्मचारी ने आपकी बुकिंग स्वीकार कर ली है।",
  },

  [BookingStatus.WORKER_REJECTED]: {
    en: "The worker rejected your booking request.",
    ar: "رفض العامل طلب الحجز الخاص بك.",
    hi: "कर्मचारी ने आपका बुकिंग अनुरोध अस्वीकार कर दिया है।",
  },

  [BookingStatus.CUSTOMER_REJECTED]: {
    en: "The booking was rejected by the customer.",
    ar: "تم رفض الحجز من قبل العميل.",
    hi: "बुकिंग ग्राहक द्वारा अस्वीकार कर दी गई है।",
  },

  [BookingStatus.WORK_START_OTP_GENERATED]: {
    en: "Share the start OTP with the worker to begin the work.",
    ar: "شارك رمز OTP الخاص بالبدء مع العامل لبدء العمل.",
    hi: "काम शुरू करने के लिए कर्मचारी के साथ प्रारंभ OTP साझा करें।",
  },

  [BookingStatus.WORK_STARTED]: {
    en: "Work has started successfully.",
    ar: "بدأ العمل بنجاح.",
    hi: "कार्य सफलतापूर्वक शुरू हो गया है।",
  },

  [BookingStatus.IN_PROGRESS]: {
    en: "Work is currently in progress.",
    ar: "العمل جارٍ حاليًا.",
    hi: "कार्य वर्तमान में प्रगति पर है।",
  },

  [BookingStatus.WORK_COMPLETE_OTP_GENERATED]: {
    en: "Work is completed. Share the completion OTP with the worker.",
    ar: "تم الانتهاء من العمل. شارك رمز OTP الخاص بالإكمال مع العامل.",
    hi: "कार्य पूरा हो गया है। कर्मचारी के साथ पूर्णता OTP साझा करें।",
  },

  [BookingStatus.WORK_COMPLETED_BY_WORKER]: {
    en: "The worker has marked the work as completed.",
    ar: "قام العامل بتحديد العمل كمكتمل.",
    hi: "कर्मचारी ने कार्य को पूर्ण के रूप में चिह्नित किया है।",
  },

  [BookingStatus.WORK_COMPLETED_PENDING]: {
    en: "Waiting for your confirmation to complete the booking.",
    ar: "في انتظار تأكيدك لإكمال الحجز.",
    hi: "बुकिंग पूर्ण करने के लिए आपकी पुष्टि की प्रतीक्षा है।",
  },

  [BookingStatus.COMPLETED]: {
    en: "Your booking has been completed successfully.",
    ar: "تم إكمال حجزك بنجاح.",
    hi: "आपकी बुकिंग सफलतापूर्वक पूरी हो गई है।",
  },

  [BookingStatus.INVOICE_GENERATED]: {
    en: "The invoice has been generated. Please review and complete payment.",
    ar: "تم إنشاء الفاتورة. يرجى مراجعتها وإكمال الدفع.",
    hi: "इनवॉइस तैयार हो गया है। कृपया समीक्षा करें और भुगतान पूरा करें।",
  },

  [BookingStatus.PAYMENT_PENDING]: {
    en: "Payment is pending. Please complete the payment.",
    ar: "الدفع معلق. يرجى إكمال الدفع.",
    hi: "भुगतान लंबित है। कृपया भुगतान पूरा करें।",
  },

  [BookingStatus.PAID]: {
    en: "Payment completed successfully. Thank you!",
    ar: "تم الدفع بنجاح. شكراً لك!",
    hi: "भुगतान सफलतापूर्वक पूरा हो गया। धन्यवाद!",
  },

  [BookingStatus.REFUND_REQUESTED]: {
    en: "Your refund request has been submitted.",
    ar: "تم إرسال طلب استرداد الأموال الخاص بك.",
    hi: "आपका रिफंड अनुरोध भेज दिया गया है।",
  },

  [BookingStatus.REFUNDED]: {
    en: "Your payment has been refunded successfully.",
    ar: "تم استرداد دفعتك بنجاح.",
    hi: "आपका भुगतान सफलतापूर्वक वापस कर दिया गया है।",
  },

 

  [BookingStatus.CUSTOMER_CANCELLED]: {
    en: "This booking was cancelled by the customer.",
    ar: "تم إلغاء هذا الحجز من قبل العميل.",
    hi: "यह बुकिंग ग्राहक द्वारा रद्द कर दी गई है।",
  },

  [BookingStatus.WORKER_CANCELLED]: {
    en: "This booking was cancelled by the worker.",
    ar: "تم إلغاء هذا الحجز من قبل العامل.",
    hi: "यह बुकिंग कर्मचारी द्वारा रद्द कर दी गई है।",
  },

  [BookingStatus.EXPIRED]: {
    en: "This booking request has expired.",
    ar: "انتهت صلاحية طلب الحجز هذا.",
    hi: "यह बुकिंग अनुरोध समाप्त हो गया है।",
  },
};
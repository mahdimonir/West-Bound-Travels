import api from "../api";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type PaymentMethod = "BKASH" | "SSLCOMMERZ";

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface InitiatePaymentPayload {
  bookingId: string;
  amount: number;
}

export interface PaymentInitiateResponse {
  paymentId: string;
  paymentUrl: string;
}

export const paymentsService = {
  /** Initiate bKash payment */
  initiateBkash: (data: InitiatePaymentPayload) =>
    api.post<ApiResponse<PaymentInitiateResponse>>("/payments/bkash/initiate", data),

  /** Initiate SSLCommerz payment */
  initiateSSLCommerz: (data: InitiatePaymentPayload) =>
    api.post<ApiResponse<PaymentInitiateResponse>>("/payments/sslcommerz/initiate", data),

  /** Verify payment status */
  verify: (paymentId: string) => api.get<ApiResponse<Payment>>(`/payments/verify/${paymentId}`),

  /** Get payment history */
  getHistory: () => api.get<ApiResponse<Payment[]>>("/payments/history"),
};

export default paymentsService;

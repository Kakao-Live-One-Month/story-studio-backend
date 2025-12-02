export interface CheckoutRequest {
    amount: number;
  }
  
  export interface CheckoutResponse {
    orderId: string;
    amount: number;
    orderName: string;
  }
  
  export interface PaymentConfirmRequest {
    paymentKey: string;
    orderId: string;
    amount: number;
  }
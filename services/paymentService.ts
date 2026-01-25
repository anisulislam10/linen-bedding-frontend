import api from './api';
import { ApiResponse } from '../types';

export const paymentService = {
    // Create payment intent
    createPaymentIntent: async (amount: number, orderId: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }> => {
        const response = await api.post<
            ApiResponse<{
                clientSecret: string;
                paymentIntentId: string;
            }>
        >('/payment/create-intent', {
            amount,
            orderId,
        });
        return response.data.data;
    },

    // Confirm payment
    confirmPayment: async (paymentIntentId: string): Promise<{ status: string }> => {
        const response = await api.post<ApiResponse<{ status: string }>>('/payment/confirm', {
            paymentIntentId,
        });
        return response.data.data;
    },
};

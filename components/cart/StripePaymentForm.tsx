import React, { useState } from 'react';
import {
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';

interface StripePaymentFormProps {
    total: number;
    clientSecret: string;
    onSuccess: (paymentIntent: any) => Promise<void>;
    onError: (message: string) => void;
    isProcessing: boolean;
    setIsProcessing: (loading: boolean) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
    total,
    clientSecret,
    onSuccess,
    onError,
    isProcessing,
    setIsProcessing
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setIsProcessing(false);
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement as any,
                },
            });

            if (error) {
                onError(error.message || 'Payment failed');
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                await onSuccess(paymentIntent);
            } else {
                onError('Payment not completed successfully');
                setIsProcessing(false);
            }
        } catch (err: any) {
            onError(err.message || 'Payment failed');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tight">
                        <Lock className="h-4 w-4 text-[#f85606]" />
                        <span>Secure Card Payment</span>
                    </h4>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded focus-within:ring-1 focus-within:ring-[#f85606] transition-all">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '14px',
                                    color: '#212121',
                                    '::placeholder': {
                                        color: '#cbd5e1',
                                    },
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                },
                                invalid: {
                                    color: '#f85606',
                                },
                            },
                        }}
                    />
                </div>
                <p className="mt-4 text-[10px] text-gray-400 font-medium text-center italic">
                    Payments are highly secured by Stripe Encrypted Protocols
                </p>
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-[#f85606] text-white py-4 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#d04a05] transition-all shadow-lg shadow-orange-100 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
                {isProcessing ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span className="text-[10px]">Processing...</span>
                    </div>
                ) : (
                    <>
                        <ShieldCheck className="h-5 w-5" />
                        <span>Confirm Payment — ${total.toFixed(2)}</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default StripePaymentForm;

import React, { useState } from 'react';
import {
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Lock, Loader2 } from 'lucide-react';

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
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold text-gray-900 flex items-center space-x-2">
                        <Lock className="h-5 w-5 text-indigo-600" />
                        <span>Secure Card Payment</span>
                    </h4>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#1a1a1a',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                    fontFamily: 'Inter, sans-serif',
                                },
                                invalid: {
                                    color: '#ef4444',
                                },
                            },
                        }}
                    />
                </div>
                <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                    Encrypted by Stripe
                </p>
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center space-x-4 hover:bg-black transition-all shadow-2xl disabled:opacity-70"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="animate-spin h-6 w-6" />
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <Lock className="h-6 w-6" />
                        <span>Confirm & Pay ${total.toFixed(2)}</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default StripePaymentForm;

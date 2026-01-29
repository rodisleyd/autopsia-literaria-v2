
// WARNING: This service exposes the Public Key and Access Token on the client side.
// This is acceptable for MVP but should be moved to a backend (Cloud Functions) for production security.

const MP_ACCESS_TOKEN = 'APP_USR-2765095476895339-121423-b7d44b9f07bcbda5e2ac5be25d7b0061-2529286445';

export interface PixPaymentResponse {
    id: string;
    qr_code: string;
    qr_code_base64: string;
    ticket_url: string;
    status: string;
    external_reference: string;
}

export const mercadoPagoService = {
    createPixPayment: async (amount: number, userEmail: string, description: string): Promise<PixPaymentResponse | null> => {
        try {
            // Call internal API (Serverless Function) to avoid CORS
            const response = await fetch('/api/create-pix', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transaction_amount: amount,
                    description: description,
                    payer: {
                        email: userEmail
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Mercado Pago Error:', errorData);
                return null;
            }

            const data = await response.json();

            // The structure returned by our API mirrors the MP API inside "point_of_interaction"
            return {
                id: data.id.toString(),
                qr_code: data.point_of_interaction.transaction_data.qr_code,
                qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64,
                ticket_url: data.point_of_interaction.transaction_data.ticket_url,
                status: data.status,
                external_reference: data.external_reference
            };
        } catch (error) {
            console.error('Error creating Pix payment:', error);
            return null;
        }
    },

    checkPaymentStatus: async (paymentId: string): Promise<string> => {
        try {
            const response = await fetch(`/api/check-payment?id=${paymentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) return 'unknown';

            const data = await response.json();
            return data.status;
        } catch (error) {
            console.error('Error checking payment status:', error);
            return 'unknown';
        }
    }
};

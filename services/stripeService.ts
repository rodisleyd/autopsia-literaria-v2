import {
    collection,
    addDoc,
    onSnapshot,
    doc,
    getDocs,
    query,
    where
} from 'firebase/firestore';
import { db, auth } from './firebase';

export const STRIPE_PRICES = {
    // Monthly Subscription (Recurring)
    SUBSCRIPTION_MONTHLY: 'price_1SuHAm2aOAYeM3X74plWIpEz',
    // Single Autopsy (One-time)
    ONE_TIME_AUTOPSY: 'price_1SuHCB2aOAYeM3X7qKqr4m8l'
};

export interface CheckoutSession {
    price: string;
    success_url: string;
    cancel_url: string;
    sessionId?: string;
    url?: string;
    error?: { message: string };
    mode?: 'subscription' | 'payment';
}

/**
 * Creates a Checkout Session in Stripe via Firebase Extension
 */
export const createCheckoutSession = async (priceId: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be logged in');

    // Determine mode based on price ID (simple check)
    const mode = priceId === STRIPE_PRICES.SUBSCRIPTION_MONTHLY ? 'subscription' : 'payment';

    // 1. Create a document in the customers/{uid}/checkout_sessions collection
    const checkoutSessionsRef = collection(db, 'customers', user.uid, 'checkout_sessions');

    const docRef = await addDoc(checkoutSessionsRef, {
        price: priceId,
        mode: mode,
        success_url: window.location.origin + '/?status=success', // Redirect back to app
        cancel_url: window.location.origin + '/?status=cancel',
    });

    // 2. Listen for changes to the document (the Extension will update it)
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(doc(db, 'customers', user.uid, 'checkout_sessions', docRef.id), (snap) => {
            const data = snap.data();

            if (data?.error) {
                unsubscribe();
                reject(new Error(data.error.message));
            }

            if (data?.url) {
                unsubscribe();
                // 3. Redirect the user to Stripe Checkout
                window.location.assign(data.url);
                resolve();
            }
        });
    });
};

/**
 * Checks if the user has an active subscription
 */
export const checkSubscriptionStatus = async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;

    const subscriptionsRef = collection(db, 'customers', user.uid, 'subscriptions');
    const q = query(subscriptionsRef, where('status', 'in', ['active', 'trialing']));

    const snapshot = await getDocs(q);
    return !snapshot.empty;
};

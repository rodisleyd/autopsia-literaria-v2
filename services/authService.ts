import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

export const authService = {
    getCurrentUser: (): Promise<User | null> => {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                unsubscribe();
                if (firebaseUser) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                        if (userDoc.exists()) {
                            resolve(userDoc.data() as User);
                        } else {
                            // If auth exists but no doc, create a basic one
                            const newUser: User = {
                                id: firebaseUser.uid,
                                email: firebaseUser.email || '',
                                name: firebaseUser.displayName || 'Autor',
                                isPro: false,
                                historyCount: 0,
                                joinedAt: Date.now()
                            };
                            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                            resolve(newUser);
                        }
                    } catch (error) {
                        console.error("Error fetching user doc:", error);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            });
        });
    },

    login: async (email: string, password: string): Promise<User> => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (userDoc.exists()) {
            return userDoc.data() as User;
        }

        // If doc doesn't exist, create it (fallback)
        const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Autor',
            isPro: false,
            historyCount: 0,
            joinedAt: Date.now()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        return newUser;
    },

    loginWithGoogle: async (): Promise<User> => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const firebaseUser = userCredential.user;

        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (userDoc.exists()) {
            return userDoc.data() as User;
        }

        const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Autor',
            isPro: false,
            historyCount: 0,
            joinedAt: Date.now()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        return newUser;
    },

    signup: async (name: string, email: string, password: string): Promise<User> => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        await updateProfile(firebaseUser, { displayName: name });

        const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: name,
            isPro: false,
            historyCount: 0,
            joinedAt: Date.now()
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        return newUser;
    },

    logout: async () => {
        await signOut(auth);
    },

    updateUser: async (user: User) => {
        await updateDoc(doc(db, 'users', user.id), { ...user });
    },

    // Admin methods
    getAllUsers: async (): Promise<User[]> => {
        const querySnapshot = await getDocs(collection(db, 'users'));
        return querySnapshot.docs.map(doc => doc.data() as User);
    },

    updateUserPermissions: async (userId: string, data: Partial<User>) => {
        await updateDoc(doc(db, 'users', userId), data);
    },

    deleteUserAccount: async (userId: string) => {
        await deleteDoc(doc(db, 'users', userId));
    },

    getUserAnalyses: async (userId: string) => {
        const q = query(
            collection(db, 'analyses'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data());
        return data.sort((a: any, b: any) => b.timestamp - a.timestamp);
    },

    getSystemStats: async () => {
        const usersSnap = await getDocs(collection(db, 'users'));
        const analysesSnap = await getDocs(collection(db, 'analyses'));

        const users = usersSnap.docs.map(doc => doc.data() as User);

        return {
            totalUsers: users.length,
            proUsers: users.filter(u => u.isPro).length,
            totalAnalyses: analysesSnap.size
        };
    }
};

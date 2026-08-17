import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/firebase/config';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  initAuth: () => () => void;
}

const createDefaultUser = (firebaseUser: FirebaseUser, role: UserRole = 'user', name?: string): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  role,
  name: name || firebaseUser.displayName || 'Player',
  avatar: firebaseUser.photoURL || '',
  city: 'Tashkent',
  rating: 1000,
  gamesPlayed: 0,
  wins: 0,
  createdAt: new Date(),
  preferredSports: ['football'],
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      firebaseUser: null,
      isLoading: true,
      isAuthenticated: false,

      initAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              set({ user: userData, firebaseUser, isAuthenticated: true, isLoading: false });
            } else {
              const newUser = createDefaultUser(firebaseUser);
              await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
              set({ user: newUser, firebaseUser, isAuthenticated: true, isLoading: false });
            }
          } else {
            set({ user: null, firebaseUser: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },

      loginWithEmail: async (email: string, password: string) => {
        set({ isLoading: true });
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
          set({ user: userDoc.data() as User, firebaseUser: result.user, isAuthenticated: true, isLoading: false });
        }
      },

      registerWithEmail: async (email: string, password: string, name: string, role: UserRole = 'user') => {
        set({ isLoading: true });
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = createDefaultUser(result.user, role, name);
        await setDoc(doc(db, 'users', result.user.uid), newUser);
        set({ user: newUser, firebaseUser: result.user, isAuthenticated: true, isLoading: false });
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        const result = await signInWithPopup(auth, googleProvider);
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
          set({ user: userDoc.data() as User, firebaseUser: result.user, isAuthenticated: true, isLoading: false });
        } else {
          const newUser = createDefaultUser(result.user);
          await setDoc(doc(db, 'users', result.user.uid), newUser);
          set({ user: newUser, firebaseUser: result.user, isAuthenticated: true, isLoading: false });
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null, firebaseUser: null, isAuthenticated: false });
      },

      updateUserProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        await updateDoc(doc(db, 'users', user.id), data);
        set({ user: { ...user, ...data } });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

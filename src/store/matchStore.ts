import { create } from 'zustand';
import { 
  collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, Timestamp, arrayUnion, arrayRemove, getDoc
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Match, SportType } from '@/types';

interface MatchState {
  matches: Match[];
  myMatches: Match[];
  currentMatch: Match | null;
  isLoading: boolean;
  
  fetchMatches: (filters?: { sport?: SportType; city?: string; status?: string }) => Promise<void>;
  fetchMyMatches: (userId: string) => Promise<void>;
  fetchMatchById: (matchId: string) => Promise<Match | null>;
  createMatch: (matchData: Omit<Match, 'id'>) => Promise<string>;
  joinMatch: (matchId: string, userId: string, userName: string) => Promise<void>;
  leaveMatch: (matchId: string, userId: string, userName: string) => Promise<void>;
  cancelMatch: (matchId: string) => Promise<void>;
}

const convertTimestamp = (data: any): Match => ({
  ...data,
  id: data.id,
  date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
});

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  myMatches: [],
  currentMatch: null,
  isLoading: false,

  fetchMatches: async (filters) => {
    set({ isLoading: true });
    try {
      let q = query(collection(db, 'matches'), orderBy('date', 'asc'));
      if (filters?.sport) q = query(q, where('sport', '==', filters.sport));
      if (filters?.status) q = query(q, where('status', '==', filters.status));
      const snapshot = await getDocs(q);
      const matches = snapshot.docs.map(d => convertTimestamp({ id: d.id, ...d.data() }));
      set({ matches, isLoading: false });
    } catch (error) {
      console.error('Error fetching matches:', error);
      set({ isLoading: false });
    }
  },

  fetchMyMatches: async (userId: string) => {
    set({ isLoading: true });
    try {
      const q = query(collection(db, 'matches'), where('players', 'array-contains', userId));
      const snapshot = await getDocs(q);
      const matches = snapshot.docs.map(d => convertTimestamp({ id: d.id, ...d.data() }));
      set({ myMatches: matches, isLoading: false });
    } catch (error) {
      console.error('Error fetching my matches:', error);
      set({ isLoading: false });
    }
  },

  fetchMatchById: async (matchId: string) => {
    try {
      const snap = await getDoc(doc(db, 'matches', matchId));
      if (snap.exists()) {
        const match = convertTimestamp({ id: snap.id, ...snap.data() });
        set({ currentMatch: match });
        return match;
      }
      return null;
    } catch (error) {
      console.error('Error fetching match:', error);
      return null;
    }
  },

  createMatch: async (matchData) => {
    const docRef = await addDoc(collection(db, 'matches'), {
      ...matchData,
      date: Timestamp.fromDate(matchData.date),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  joinMatch: async (matchId, userId, userName) => {
    const ref = doc(db, 'matches', matchId);
    await updateDoc(ref, { players: arrayUnion(userId), playerNames: arrayUnion(userName) });
    const { matches, currentMatch } = get();
    const update = (m: Match) => m.id === matchId 
      ? { ...m, players: [...m.players, userId], playerNames: [...m.playerNames, userName] } 
      : m;
    set({ matches: matches.map(update), myMatches: get().myMatches.map(update) });
    if (currentMatch?.id === matchId) set({ currentMatch: update(currentMatch) });
  },

  leaveMatch: async (matchId, userId, userName) => {
    const ref = doc(db, 'matches', matchId);
    await updateDoc(ref, { players: arrayRemove(userId), playerNames: arrayRemove(userName) });
    const { matches, currentMatch } = get();
    const update = (m: Match) => m.id === matchId 
      ? { ...m, players: m.players.filter(id => id !== userId), playerNames: m.playerNames.filter(n => n !== userName) } 
      : m;
    set({ matches: matches.map(update), myMatches: get().myMatches.map(update) });
    if (currentMatch?.id === matchId) set({ currentMatch: update(currentMatch) });
  },

  cancelMatch: async (matchId: string) => {
    await updateDoc(doc(db, 'matches', matchId), { status: 'cancelled' });
    const { matches, currentMatch } = get();
    const update = (m: Match) => m.id === matchId ? { ...m, status: 'cancelled' as const } : m;
    set({ matches: matches.map(update), myMatches: get().myMatches.map(update) });
    if (currentMatch?.id === matchId) set({ currentMatch: update(currentMatch) });
  },
}));

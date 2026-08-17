import { create } from 'zustand';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Venue, VenueStatus } from '@/types';

interface VenueState {
  venues: Venue[];
  myVenues: Venue[];
  currentVenue: Venue | null;
  isLoading: boolean;
  
  fetchVenues: () => Promise<void>;
  fetchMyVenues: (ownerId: string) => Promise<void>;
  fetchVenueById: (venueId: string) => Promise<Venue | null>;
  createVenue: (venueData: Omit<Venue, 'id'>) => Promise<string>;
  updateVenue: (venueId: string, data: Partial<Venue>) => Promise<void>;
  deleteVenue: (venueId: string) => Promise<void>;
  updateVenueStatus: (venueId: string, status: VenueStatus) => Promise<void>;
}

export const useVenueStore = create<VenueState>((set, get) => ({
  venues: [],
  myVenues: [],
  currentVenue: null,
  isLoading: false,

  fetchVenues: async () => {
    set({ isLoading: true });
    try {
      const snapshot = await getDocs(collection(db, 'venues'));
      const venues = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Venue));
      set({ venues, isLoading: false });
    } catch (error) {
      console.error('Error fetching venues:', error);
      set({ isLoading: false });
    }
  },

  fetchMyVenues: async (ownerId: string) => {
    set({ isLoading: true });
    try {
      const q = query(collection(db, 'venues'), where('ownerId', '==', ownerId));
      const snapshot = await getDocs(q);
      set({ myVenues: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Venue)), isLoading: false });
    } catch (error) {
      console.error('Error fetching my venues:', error);
      set({ isLoading: false });
    }
  },

  fetchVenueById: async (venueId: string) => {
    try {
      const snap = await getDoc(doc(db, 'venues', venueId));
      if (snap.exists()) {
        const venue = { id: snap.id, ...snap.data() } as Venue;
        set({ currentVenue: venue });
        return venue;
      }
      return null;
    } catch (error) {
      console.error('Error fetching venue:', error);
      return null;
    }
  },

  createVenue: async (venueData) => {
    const docRef = await addDoc(collection(db, 'venues'), { ...venueData, createdAt: new Date() });
    return docRef.id;
  },

  updateVenue: async (venueId, data) => {
    await updateDoc(doc(db, 'venues', venueId), data);
    const update = (v: Venue) => v.id === venueId ? { ...v, ...data } : v;
    set({ venues: get().venues.map(update), myVenues: get().myVenues.map(update) });
    if (get().currentVenue?.id === venueId) set({ currentVenue: { ...get().currentVenue!, ...data } });
  },

  deleteVenue: async (venueId) => {
    await deleteDoc(doc(db, 'venues', venueId));
    set({ 
      venues: get().venues.filter(v => v.id !== venueId), 
      myVenues: get().myVenues.filter(v => v.id !== venueId),
      currentVenue: get().currentVenue?.id === venueId ? null : get().currentVenue,
    });
  },

  updateVenueStatus: async (venueId, status) => {
    await updateDoc(doc(db, 'venues', venueId), { status });
    const update = (v: Venue) => v.id === venueId ? { ...v, status } : v;
    set({ venues: get().venues.map(update), myVenues: get().myVenues.map(update) });
  },
}));

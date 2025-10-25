import { create } from "zustand";
import { Lead, User } from "@/types";

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Leads
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // UI
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Leads
  leads: [],
  setLeads: (leads) => set({ leads }),
  addLead: (lead) => set((state) => ({ leads: [lead, ...state.leads] })),
  updateLead: (id, updatedLead) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead._id === id ? { ...lead, ...updatedLead } : lead
      ),
    })),
  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((lead) => lead._id !== id),
    })),

  // UI
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Filters
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  statusFilter: "all",
  setStatusFilter: (status) => set({ statusFilter: status }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PassionNode {
  id: string;
  name: string;
  group: number; // 1: Concept, 2: Tool/Technology, 3: Person/Resource
  val: number; // Size/Importance (1-10)
  description: string;
}

export interface PassionLink {
  source: string;
  target: string;
  value: number; // Strength of relationship
}

export interface GraphData {
  nodes: PassionNode[];
  links: PassionLink[];
}

interface AppState {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  removeApiKey: () => void;
  
  currentDomain: string | null;
  setCurrentDomain: (domain: string) => void;
  
  graphData: GraphData | null;
  setGraphData: (data: GraphData | null) => void;
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  selectedNode: PassionNode | null;
  setSelectedNode: (node: PassionNode | null) => void;
  
  history: string[];
  addHistory: (domain: string) => void;
  clearHistory: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: null,
      setApiKey: (key) => set({ apiKey: key }),
      removeApiKey: () => set({ apiKey: null }),
      
      currentDomain: null,
      setCurrentDomain: (domain) => set({ currentDomain: domain }),
      
      graphData: null,
      setGraphData: (data) => set({ graphData: data }),
      
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      selectedNode: null,
      setSelectedNode: (node) => set({ selectedNode: node }),
      
      history: [],
      addHistory: (domain) => set((state) => {
        const filtered = state.history.filter((h) => h.toLowerCase() !== domain.toLowerCase());
        return { history: [domain, ...filtered].slice(0, 5) };
      }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'passionaut-storage',
      partialize: (state) => ({ apiKey: state.apiKey, history: state.history }), // Persist API key and history
    }
  )
);

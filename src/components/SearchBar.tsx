'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { generateGraph } from '@/lib/gemini';
import { playSuccessSweep, playBeep } from '@/lib/audio';
import { Search, Loader2 } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

export default function SearchBar() {
  const { apiKey, currentDomain, setCurrentDomain, setGraphData, isLoading, setIsLoading, addHistory } = useStore();
  const [query, setQuery] = useState('');

  const springs = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 500,
  });

  // Watch currentDomain changes to support suggestions triggers
  useEffect(() => {
    if (currentDomain && currentDomain !== query) {
      setQuery(currentDomain);
      triggerSearch(currentDomain);
    }
  }, [currentDomain]);

  const triggerSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || !apiKey || isLoading) return;
    setIsLoading(true);
    playBeep(440, 'sine', 0.2, 0.05); // Play init search sweep

    try {
      const data = await generateGraph(searchQuery.trim(), apiKey);
      setGraphData(data);
      addHistory(searchQuery.trim());
      playSuccessSweep();
    } catch (error) {
      console.error('Failed to generate graph:', error);
      playBeep(220, 'sawtooth', 0.3, 0.08); // Error tone
      alert('Failed to generate graph. Check your API key or try a different topic.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    setCurrentDomain(query.trim());
  };

  return (
    <animated.div style={springs} className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-cyan-500/25 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="relative flex items-center bg-[#0a0a0f]/80 backdrop-blur-md border border-[#1a1a24] rounded-full overflow-hidden shadow-2xl">
          <div className="pl-5 pr-2">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-cyan-500/50" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Map a passion domain (e.g., Quantum Computing, Typography)..."
            className="flex-1 bg-transparent py-4 pr-6 text-white placeholder-white/30 focus:outline-none font-sans"
            disabled={isLoading || !apiKey}
          />
          <button 
            type="submit"
            disabled={isLoading || !apiKey || !query.trim()}
            className="hidden"
          >
            Search
          </button>
        </div>
      </form>
    </animated.div>
  );
}

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import APIKeyTerminal from '@/components/APIKeyTerminal';
import SearchBar from '@/components/SearchBar';
import Sidebar from '@/components/Sidebar';
import { useSpring, animated } from '@react-spring/web';

// Dynamically import 3D graph with SSR disabled
const AtlasGraph = dynamic(() => import('@/components/AtlasGraph'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508]">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  )
});

export default function Home() {
  const { 
    apiKey, 
    graphData, 
    isLoading, 
    setCurrentDomain, 
    setGraphData, 
    setSelectedNode, 
    history 
  } = useStore();

  useEffect(() => {
    if (apiKey && !graphData && !isLoading) {
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get('q');
      if (queryParam) {
        setCurrentDomain(queryParam);
      }
    }
  }, [apiKey, graphData, isLoading, setCurrentDomain]);

  const loadingSprings = useSpring({
    opacity: isLoading ? 1 : 0,
    pointerEvents: isLoading ? 'auto' : 'none',
    config: { duration: 500 }
  });

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050508]">
      {/* Brand Header */}
      <div className="absolute top-6 left-6 z-30 flex items-center gap-4 pointer-events-auto select-none">
        <button 
          onClick={() => {
            setCurrentDomain('');
            setGraphData(null);
            setSelectedNode(null);
          }}
          className="font-heading font-black tracking-widest text-white hover:text-cyan-400 text-glow-cyan transition-colors duration-300 text-sm cursor-pointer"
        >
          PASSIONAUT
        </button>
        <div className="h-4 w-px bg-white/10" />
        <a 
          href="https://github.com/johnnylemonny/passionaut"
          target="_blank"
          rel="noreferrer"
          className="text-white/40 hover:text-white transition-colors duration-300"
          title="View source on GitHub"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>

      {/* Welcome Landing Page (Empty State) */}
      {!graphData && !isLoading && apiKey && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-magenta-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="text-center max-w-2xl space-y-6 select-none">
            <h1 className="text-6xl md:text-8xl font-heading font-black tracking-widest text-white text-glow-cyan animate-pulse">
              PASSIONAUT
            </h1>
            <p className="text-cyan-400/60 font-heading text-xs tracking-[0.3em] uppercase font-bold">
              Cybernetic Atlas of Human Obsession
            </p>
            <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed pt-2">
              Enter any domain, technology, or passion above to map out a highly detailed, 3D interactive knowledge web generated in real-time.
            </p>
            
            <div className="space-y-4 pt-6">
              <div className="flex flex-wrap justify-center gap-3 pointer-events-auto">
                <span className="text-xs text-white/30 self-center font-heading uppercase tracking-wider">Try:</span>
                {['Astrophysics', 'Mechanical Keyboards', 'Procedural Generation', 'Fermentation'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setCurrentDomain(topic)}
                    className="bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] hover:border-cyan-500/50 text-white/60 hover:text-cyan-400 text-xs px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Persisted History */}
              {history.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 pt-2 pointer-events-auto">
                  <span className="text-xs text-white/20 self-center font-heading uppercase tracking-wider">Recent:</span>
                  {history.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setCurrentDomain(topic)}
                      className="bg-[#08080c]/50 hover:bg-[#101016] border border-[#161622] hover:border-cyan-500/30 text-white/40 hover:text-cyan-400/80 text-xs px-3 py-1 rounded-full transition-all duration-300 cursor-pointer"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3D WebGL Background / Graph Layer */}
      {apiKey && <AtlasGraph />}
      
      {/* UI Overlay Layer */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="pointer-events-auto">
          <SearchBar />
        </div>
        
        <div className="pointer-events-auto">
          <Sidebar />
        </div>
      </div>

      {/* Loading Overlay */}
      <animated.div 
        style={loadingSprings as any} 
        className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
      >
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4 box-glow-cyan" />
        <h2 className="text-cyan-400 font-heading tracking-widest uppercase text-sm animate-pulse text-glow-cyan">
          Synthesizing Knowledge Web...
        </h2>
      </animated.div>

      {/* Initialization Modal */}
      <APIKeyTerminal />
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useStore } from '@/store/useStore';
import { Terminal, Key, ArrowRight } from 'lucide-react';

export default function APIKeyTerminal() {
  const { apiKey, setApiKey } = useStore();
  const [input, setInput] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const springs = useSpring({
    opacity: isMounted && !apiKey ? 1 : 0,
    transform: isMounted && !apiKey ? 'translateY(0px)' : 'translateY(40px)',
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const overlaySprings = useSpring({
    opacity: isMounted && !apiKey ? 1 : 0,
    pointerEvents: isMounted && !apiKey ? 'auto' : 'none',
  });

  if (!isMounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length > 10) {
      setApiKey(input.trim());
    }
  };

  return (
    <animated.div 
      style={overlaySprings as any}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <animated.div 
        style={springs}
        className="w-full max-w-lg bg-[#0a0a0f] border border-[#1a1a24] rounded-2xl shadow-2xl overflow-hidden box-glow-cyan"
      >
        <div className="bg-[#12121a] border-b border-[#1a1a24] p-4 flex items-center gap-3">
          <Terminal className="text-cyan-400 w-5 h-5" />
          <h2 className="text-sm font-heading tracking-widest uppercase text-white/80">System Initialization</h2>
        </div>
        
        <div className="p-6 md:p-8">
          <p className="text-white/70 mb-6 leading-relaxed">
            Passionaut is a serverless, static atlas. To map the universe of knowledge, please provide your Google Gemini API key. 
            <br/><br/>
            <span className="text-xs text-white/50">Your key is stored locally in your browser and never transmitted anywhere except directly to Google's API.</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="text-white/40 w-5 h-5" />
              </div>
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#12121a] border border-[#2a2a35] rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800 rounded-xl py-3 font-medium transition-colors group"
            >
              <span>Initialize Atlas Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <a 
               href="https://aistudio.google.com/apikey" 
               target="_blank" 
               rel="noreferrer"
               className="text-xs text-cyan-500 hover:text-cyan-400 underline decoration-cyan-900 underline-offset-4"
             >
               Get a free Gemini API key here
             </a>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
}

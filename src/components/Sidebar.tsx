'use client';

import { useStore } from '@/store/useStore';
import { useSpring, animated } from '@react-spring/web';
import { X, Network, BookOpen, Wrench, User, Share2 } from 'lucide-react';

export default function Sidebar() {
  const { selectedNode, setSelectedNode, graphData, currentDomain } = useStore();

  const springs = useSpring({
    transform: selectedNode ? 'translateX(0%)' : 'translateX(100%)',
    opacity: selectedNode ? 1 : 0,
    config: { mass: 1, tension: 170, friction: 20 },
  });

  const getIcon = (group: number) => {
    switch (group) {
      case 1: return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 2: return <Wrench className="w-5 h-5 text-magenta-400" />;
      case 3: return <User className="w-5 h-5 text-amber-400" />;
      default: return <Network className="w-5 h-5 text-white" />;
    }
  };

  const getGroupLabel = (group: number) => {
    switch (group) {
      case 1: return <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Concept</span>;
      case 2: return <span className="text-magenta-400 text-xs font-bold uppercase tracking-wider">Tool / Tech</span>;
      case 3: return <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Person / Resource</span>;
      default: return null;
    }
  };

  return (
    <>
      {/* Global Stats Overlay (always visible if data exists) */}
      {graphData && !selectedNode && (
        <div className="absolute bottom-6 left-6 z-10 bg-[#0a0a0f]/80 backdrop-blur-md border border-[#1a1a24] p-4 rounded-xl shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-cyan-500" />
            <h3 className="text-white/90 font-heading font-medium text-sm">{currentDomain} Atlas</h3>
          </div>
          <div className="flex gap-4 text-xs text-white/50 mb-3">
            <div>Nodes: <span className="text-white">{graphData.nodes.length}</span></div>
            <div>Connections: <span className="text-white">{graphData.links.length}</span></div>
          </div>
          
          <button 
            onClick={() => {
              const shareUrl = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(currentDomain || '')}`;
              navigator.clipboard.writeText(shareUrl);
              alert('Shareable link copied to clipboard!');
            }}
            className="w-full flex items-center justify-center gap-1.5 bg-[#12121a] hover:bg-[#1a1a24] border border-[#2a2a35] hover:border-cyan-500/50 text-white/70 hover:text-cyan-400 text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Share Link</span>
          </button>
        </div>
      )}

      {/* Selected Node Details Panel */}
      <animated.div 
        style={springs}
        className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-[#050508]/95 backdrop-blur-xl border-l border-[#1a1a24] z-20 shadow-2xl overflow-y-auto"
      >
        {selectedNode && (
          <div className="p-6">
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#12121a] hover:bg-[#1a1a24] text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="mt-8 mb-4 flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#12121a] border border-[#1a1a24]">
                {getIcon(selectedNode.group)}
              </div>
              <div>
                {getGroupLabel(selectedNode.group)}
                <h2 className="text-xl font-heading font-bold text-white mt-1">{selectedNode.name}</h2>
              </div>
            </div>
            
            <div className="bg-[#12121a] rounded-xl p-5 border border-[#1a1a24] mt-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Analysis</h3>
              <p className="text-white/80 leading-relaxed text-sm">
                {selectedNode.description}
              </p>
            </div>
            
            <div className="mt-6 flex justify-between items-center text-xs text-white/40">
              <span>Importance Score:</span>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-4 rounded-sm ${i < selectedNode.val ? 'bg-cyan-500' : 'bg-[#1a1a24]'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </animated.div>
    </>
  );
}

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import { useStore, PassionNode } from '@/store/useStore';
import { playBeep } from '@/lib/audio';
import * as THREE from 'three';

export default function AtlasGraph() {
  const { graphData, setSelectedNode } = useStore();
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Responsive canvas
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getNodeColor = (group: number) => {
    if (group === 1) return '#00f3ff'; // Concept (Cyan)
    if (group === 2) return '#ff00ff'; // Tool (Magenta)
    return '#ffb703'; // Person/Resource (Amber)
  };

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node as PassionNode);
    playBeep(587.33, 'triangle', 0.1, 0.04); // D5 note for node select
    
    if (fgRef.current) {
      // Aim at node from outside it
      const distance = 100;
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
      
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        2000  // ms transition duration
      );
    }
  }, [setSelectedNode]);

  if (!graphData) return null;

  return (
    <div className="absolute inset-0 z-0 bg-[#050508]">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#050508"
        showNavInfo={false}
        nodeThreeObject={(node: any) => {
          const group = new THREE.Group();
          
          // Outer Glow Sphere
          const size = (node.val || 4) * 0.75 + 2;
          const geom = new THREE.SphereGeometry(size, 24, 24);
          const mat = new THREE.MeshBasicMaterial({
            color: getNodeColor(node.group),
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
          });
          const sphere = new THREE.Mesh(geom, mat);
          group.add(sphere);

          // Core Sphere (smaller, solid)
          const coreGeom = new THREE.SphereGeometry(size * 0.4, 16, 16);
          const coreMat = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.9
          });
          const core = new THREE.Mesh(coreGeom, coreMat);
          group.add(core);

          // Floating Text Label for all nodes (scaled proportionally to node size to prevent clutter)
          try {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
              const name = String(node.name || 'Landmark');
              
              // Temp context to measure text
              context.font = 'bold 24px "Space Grotesk", sans-serif';
              const textWidth = context.measureText(name).width || 120;
              
              // Resize canvas based on text size (with padding)
              canvas.width = Math.max(256, Math.ceil(textWidth) + 48);
              canvas.height = 64;
              
              // Context properties are reset on canvas resize, so re-apply
              context.textAlign = 'center';
              context.textBaseline = 'middle';
              context.font = 'bold 24px "Space Grotesk", sans-serif';
              
              const centerX = canvas.width / 2;
              const centerY = canvas.height / 2;
              
              // Draw text shadow
              context.fillStyle = 'rgba(0, 0, 0, 0.8)';
              context.fillText(name, centerX + 2, centerY + 2);
              
              // Draw main text
              context.fillStyle = '#ffffff';
              context.fillText(name, centerX, centerY);
              
              const texture = new THREE.CanvasTexture(canvas);
              const spriteMaterial = new THREE.SpriteMaterial({ 
                map: texture, 
                transparent: true,
                depthWrite: false
              });
              const sprite = new THREE.Sprite(spriteMaterial);
              
              // Scale sprite width relative to dynamic canvas size and node size (2.2 multiplier instead of 2.8)
              const labelWidth = size * 2.2 * (canvas.width / 256);
              const labelHeight = labelWidth * (canvas.height / canvas.width);
              
              sprite.scale.set(labelWidth, labelHeight, 1);
              sprite.position.y = size + labelHeight / 2 + 1; // Position above the node
              group.add(sprite);
            }
          } catch (err) {
            console.error("Error creating label sprite:", err);
          }

          return group;
        }}
        linkColor={() => 'rgba(255, 255, 255, 0.08)'}
        linkWidth={0.8}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={1.8}
        linkDirectionalParticleSpeed={0.006}
        linkDirectionalParticleColor={(link: any) => {
           const source = link.source as any;
           return getNodeColor(source.group);
        }}
        onNodeHover={(node: any, prevNode: any) => {
          if (node && node !== prevNode) {
            playBeep(987.77, 'sine', 0.02, 0.005); // Tiny high-pitch B5 tick on hover
          }
        }}
        onNodeClick={handleNodeClick}
        enableNodeDrag={false}
      />
    </div>
  );
}

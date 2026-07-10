import { GoogleGenAI } from '@google/genai';
import { GraphData } from '@/store/useStore';

export async function generateGraph(domain: string, apiKey: string): Promise<GraphData> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are the core engine of "Passionaut - Deep-Dive Passion Atlas".
    Your goal is to map the domain/passion: "${domain}".
    
    You must output a highly detailed, comprehensive knowledge graph of this domain in JSON format.
    The graph must contain at least 40 nodes to ensure a visually complex and overwhelming "WOW effect".
    
    Nodes should be categorized into 3 groups:
    1: Core Concepts & Sub-disciplines
    2: Tools, Technologies, & Methods
    3: Key Figures, Seminal Works, & Communities
    
    For each node, provide:
    - id: A unique string identifier (no spaces)
    - name: The human-readable name of the node
    - group: The integer 1, 2, or 3 as defined above
    - val: An integer from 1 to 10 indicating importance/size (10 being central/foundational, 1 being niche)
    - description: A short, concrete 1-2 sentence description.
    
    For links, connect nodes that have strong relationships (e.g., a person created a tool, a tool is used in a concept).
    Ensure the graph is highly interconnected (not just a tree, but a web). Provide at least 60 links.
    - source: id of the source node
    - target: id of the target node
    - value: integer 1-5 indicating connection strength
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            nodes: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  id: { type: 'STRING' },
                  name: { type: 'STRING' },
                  group: { type: 'INTEGER' },
                  val: { type: 'INTEGER' },
                  description: { type: 'STRING' },
                },
                required: ['id', 'name', 'group', 'val', 'description'],
              },
            },
            links: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  source: { type: 'STRING' },
                  target: { type: 'STRING' },
                  value: { type: 'INTEGER' },
                },
                required: ['source', 'target', 'value'],
              },
            },
          },
          required: ['nodes', 'links'],
        },
      },
    });

    const text = response.text || "{}";
    const rawData = JSON.parse(text) as GraphData;
    
    // Clean and validate graph data to prevent force-graph runtime crashes
    const nodes = Array.isArray(rawData.nodes) ? rawData.nodes : [];
    const rawLinks = Array.isArray(rawData.links) ? rawData.links : [];
    
    // Filter duplicates and invalid nodes, keeping unique IDs
    const seenNodeIds = new Set<string>();
    const sanitizedNodes = nodes.filter(node => {
      if (!node.id) return false;
      const normalizedId = String(node.id).trim();
      if (seenNodeIds.has(normalizedId)) {
        return false;
      }
      seenNodeIds.add(normalizedId);
      node.id = normalizedId;
      return true;
    });

    // Keep only links where both source and target correspond to active nodes
    const sanitizedLinks = rawLinks.filter(link => {
      const sourceId = String(link.source || '').trim();
      const targetId = String(link.target || '').trim();
      
      const sourceExists = seenNodeIds.has(sourceId);
      const targetExists = seenNodeIds.has(targetId);
      
      if (sourceExists && targetExists) {
        link.source = sourceId;
        link.target = targetId;
        return true;
      } else {
        console.warn(`[Sanitizer] Removed link pointing to non-existent node: "${sourceId}" -> "${targetId}"`);
        return false;
      }
    });

    return {
      nodes: sanitizedNodes,
      links: sanitizedLinks
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

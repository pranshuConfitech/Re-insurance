declare module 'react-graph-vis' {
    import type { FC } from 'react';
  
    interface GraphProps {
      graph: {
        nodes: Array<{ id: number; label: string }>;
        edges: Array<{ from: number; to: number }>;
      };
      options: Record<string, any>;
      events?: Record<string, (event: any) => void>;
    }
  
    const Graph: FC<GraphProps>;
    export default Graph;
  }
  
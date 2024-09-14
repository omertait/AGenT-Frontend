import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Panel
} from 'reactflow';
  

const Canvas = ({
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect
}) => {

return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}>
            <Panel position="top-left">
                <button onClick={() => alert('test')}>Add</button>
            </Panel>
            <Controls/>
            {/* <MiniMap /> */}
            <Background variant="dots" gap={12} size={1} />
            
        </ReactFlow>
    </div>
);
};

export default Canvas;
import React from 'react';
import ConnectionStatus from '../../ConnectionStatus';

const Sidebar = ({ 
  nodeTypes, 
  handleOpenGenWindow, 
  currentExampleIndex, 
  setCurrentExampleIndex, 
  handleBuildClick, 
  isConnected, }) => {
  

  return (
    <aside>
        <div className="dndnodes">
        <h2>Drag & Drop Tasks</h2>
        <div className="description">You can drag these Task-Nodes to the Canvas on the right.</div>
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="dndnode"
            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', node.label)}
            draggable
          >
            {node.label}
          </div>
        ))}
        </div>
        <div className='actions'>
        <ConnectionStatus isConnected={isConnected} />
          {/* TO IMPLEMENT - generating workflows with prompt to llms based on JSON Schema */}
          {/* currently using fixed examples */}
          <button className='generate-button' onClick={() => isConnected ? handleOpenGenWindow() : setCurrentExampleIndex((currentExampleIndex+1)%4)}>Generate</button>
          <button className='build-button' onClick={handleBuildClick}>Build</button>
        </div>
      </aside>
  );
};

export default Sidebar;

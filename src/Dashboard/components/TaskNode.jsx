import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './TaskNode.css';

export default memo(({ data, isConnectable }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={data.isStartNode ? 'task-node start' : 'task-node'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {!data.isStartNode && 
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />}
      
      <div className="task-name">{data.taskName}</div>
      <div className="agent-name">{data.agent}</div>
      {showTooltip && (
        <div className="tooltip">
          Double click to define/edit task
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        id="handle-source"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
});

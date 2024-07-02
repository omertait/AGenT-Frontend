import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, isConnectable }) => {
  return (
    <div className={data.isStartNode ? 'task-node start' : 'task-node'}>
      {!data.isStartNode && 
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />}
      
      <div className="task-name">{data.taskName}</div>
      <div className="agent-name">{data.agent}</div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
});

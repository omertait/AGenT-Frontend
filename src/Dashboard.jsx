import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TaskNode from './TaskNode';
import './Dashboard.css';

const initialNodes = [
  { id: '1', type: 'customNode', position: { x: 250, y: 5 }, data: { isStartNode: true, taskName: 'Start Task', agent: 'Initial Agent'} },
];

const nodeTypes = [
  { type: 'LLM_interact', label: 'Interact' },
  { type: 'tool', label: 'RAG' },
  { type: 'update_memory', label: 'Update Memory' },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodesTypes = { customNode: TaskNode };

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [startNode, setStartNode] = useState(initialNodes[0]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [editNode, setEditNode] = useState(null);

  const graphToJSON = () => {
    let graph = { nodes: [], edges: [] };
    nodes.forEach((node) => {
      graph.nodes.push({ id: node.id, data: node.data, position: node.position });
    });
    edges.forEach((edge) => {
      graph.edges.push({ id: edge.id, source: edge.source, target: edge.target });
    });
    return JSON.stringify(graph, null, 2);
  }

  const checkIfGraphConnected = () => {
    let visited = {};
    // check if there is only one start node and retrieve it
    let startNode = null;
    nodes.forEach((node) => {
      if (node.data.isStartNode) {
        if (startNode) {
          console.log("Invalid - Multiple start nodes");
          return false;
        }
        startNode = node;
      }
    });
    let queue = [startNode.id];
    while (queue.length > 0) {
      let node = queue.shift();
      if (visited[node]) continue;
      visited[node] = true;
      edges.forEach((edge) => {
        if (edge.source === node) {
          queue.push(edge.target);
        }
      });
    }
    return Object.keys(visited).length === nodes.length;
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed }}, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type: 'customNode',
        position,
        data: { isStartNode: false, taskName: `${type} Task`, agent: 'Unassigned' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onNodeDoubleClick = useCallback((event, node) => {
    event.preventDefault();
    setEditNode(node);
  }, []);

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this task?')) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
    }
  }, [setNodes, setEdges]);

  const onSaveEdit = useCallback((id, isStartNode, taskName, agent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          if (isStartNode){
            // delete all incoming edges
            setEdges((eds) => eds.filter((e) => e.target !== id));
          }
          return { ...node, data: { ...node.data, isStartNode, taskName, agent } };
        }
        return node;
      })
    );
    setEditNode(null);
  }, [setNodes]);

  return (
    <div className="dndflow">
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
          <button className='build-button' onClick={()=> checkIfGraphConnected() ? console.log(graphToJSON()) : console.log("Not Valid - Graph is not connected")}>Build</button>
          <button className='export-button' onClick={()=> setNodes(initialNodes)}>Export</button>
        </div>
      </aside>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeContextMenu={onNodeContextMenu}
            nodeTypes={nodesTypes}
            snapToGrid={true}
            fitView
          >
            <Controls />
            {/* <MiniMap /> */}
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      {editNode && (
        <div className="edit-modal">
          <h3>Edit Task</h3>
          <div style={{'display': 'flex', 'justifyContent': 'space-between'}}>
          <label>Start Node</label>
            <input
            type='checkbox'
            checked={editNode.data.isStartNode}
            onChange={(e) => setEditNode({ ...editNode, data: { ...editNode.data, isStartNode: e.target.checked } })}
            placeholder="Start Node"
          />
          </div>
          
          <input
            type="text"
            value={editNode.data.taskName}
            onChange={(e) => setEditNode({ ...editNode, data: { ...editNode.data, taskName: e.target.value } })}
            placeholder="Task Name"
          />
          <input
            type="text"
            value={editNode.data.agent}
            onChange={(e) => setEditNode({ ...editNode, data: { ...editNode.data, agent: e.target.value } })}
            placeholder="Assigned Agent"
          />
          <button onClick={() => onSaveEdit(editNode.id, editNode.data.isStartNode, editNode.data.taskName, editNode.data.agent)}>Save</button>
          <button onClick={() => setEditNode(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  return (
    <>
      <DnDFlow />
    </>
  );
};

export default Dashboard;
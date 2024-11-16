import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import TaskNode from './components/TaskNode';
import './Dashboard.css';
import EditTask from './EditTask';
import GenerateWindow from './GenerateWindow';
import { checkIfGraphConnected, graphToJSON } from './build';
import Sidebar from './Sidebar';


const nodeTypes = [
  // Existing LLM Interact Node
  {
    type: 'LLM_interact',
    label: 'LLM Interact',
    data: {
      steps: [
        {
          type: "llm_interact",
          promptTemplate: "Respond to the following: {task_input}\n\nAct as a helpful assistant.",
          model: "gpt-4o-mini"
        }
      ]
    }
  },

  // 1. Memory Update Node
  {
    type: 'Memory_update',
    label: 'Update Memory',
    data: {
      steps: [
        {
          type: "update_memory",
          memory_arg: "user_preference"
        }
      ]
    }
  },

  // 2. Tool Usage Node
  {
    type: 'Math_tool_usage',
    label: 'Math Calculation',
    data: {
      steps: [
        {
          type: "tool",
          tool: "calculator",
          input_data_func: "{\"x\": int(task_input), \"y\": 2, \"operation\": \"add\"}"
        }
      ]
    }
  },

  // 3. LLM Interact Node with Common Template
  {
    type: 'Summarize_text',
    label: 'Summarize Text',
    data: {
      steps: [
        {
          type: "llm_interact",
          promptTemplate: "Summarize the following text into a concise and clear summary:\n\n{task_input}.",
          model: "gpt-4o"
        }
      ]
    }
  }
];


let id = 0;
const getId = () => `dndnode_${id++}`;

const nodesTypes = { customNode: TaskNode };

const Dashboard = ({
  nodes, setNodes, onNodesChange,
  edges, setEdges, onEdgesChange,
  agents, tools, setCurrentExampleIndex, currentExampleIndex, isConnected, ws
}) => {


  const [isGenWindowOpen, setGenWindowOpen] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleOpenGenWindow = () => setGenWindowOpen(true);
  const handleCloseGenWindow = () => setGenWindowOpen(false);

  const handleSubmit = (prompt) => {
    console.log('Submitting:', prompt);
    // TO IMPLEMENT - send prompt to backend to generate workflow
    setGenWindowOpen(false);
  };

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [editNode, setEditNode] = useState(null);
  

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
  
      const nodeType = nodeTypes.find(n => n.label === type);
  
      // if there are no start nodes, set the first node as the start node
      const newNode = {
        id: getId(),
        type: 'customNode',
        position,
        data: {
          isStartNode: nodes.length === 0,
          taskName: `${type} Task`,
          agent: 'Assistent',
          ...nodeType.data,  // spread the data from the nodeTypes definition
        },
      };
  
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes]
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

  const onSaveEdit = useCallback((id, isStartNode, taskName, agent, steps) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          if (isStartNode){
            // delete all incoming edges
            setEdges((eds) => eds.filter((e) => e.target !== id));
          }
          return { ...node, data: { ...node.data, isStartNode, taskName, agent, steps } };
        }
        return node;
      })
    );
    setEditNode(null);
  }, [setNodes]);

  const handleBuildClick = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }
    
    const [isValid, msg] = checkIfGraphConnected(nodes, edges, tools, agents);
    if (!isValid) {
      console.error(msg);
      return;
    }
    const json = graphToJSON(nodes, edges, tools, agents);
    ws.send(json);
  };

  return (
    <div className="Dashboard">
      <Sidebar 
        nodeTypes={nodeTypes} 
        handleOpenGenWindow={handleOpenGenWindow} 
        setCurrentExampleIndex={setCurrentExampleIndex} 
        handleBuildClick={handleBuildClick} 
        isConnected={isConnected}
        currentExampleIndex={currentExampleIndex}
      />
      <GenerateWindow
        isOpen={isGenWindowOpen}
        onClose={handleCloseGenWindow}
        onSubmit={handleSubmit}
        prompt={prompt}
        setPrompt={setPrompt}
      />
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
        <EditTask 
          editNode={editNode}
          setEditNode={setEditNode}
          onSaveEdit={onSaveEdit}
          agents={agents}
        />
      )}
    </div>
  );
};


export default Dashboard;
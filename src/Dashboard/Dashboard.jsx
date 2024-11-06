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
import TaskNode from './components/TaskNode';
import './Dashboard.css';
import EditTask from './EditTask';
import GenerateWindow from './GenerateWindow';


const nodeTypes = [
  { type: 'LLM_interact', label: 'Interact' , data: { steps: [{type : "llm_interact", promptTemplate : "responed to the following: {task_input}\n\nact as a friend.", model: "gpt-4o-mini"}] } },
  // { type: 'tool', label: 'RAG', data: { steps: [] } },
  // { type: 'update_memory', label: 'Update Memory', data: { steps: [] } },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodesTypes = { customNode: TaskNode };

const Dashboard = ({
  nodes, setNodes, onNodesChange,
  edges, setEdges, onEdgesChange,
  agents, tools, setCurrentExampleIndex, currentExampleIndex
}) => {

  const [isGenWindowOpen, setGenWindowOpen] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleOpenGenWindow = () => setGenWindowOpen(true);
  const handleCloseGenWindow = () => setGenWindowOpen(false);

  const handleSubmit = (prompt) => {
    console.log('Submitting:', prompt);
    // Add your code here to send the prompt to your backend
    setGenWindowOpen(false);
  };

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [editNode, setEditNode] = useState(null);
  const reshapeJson = (clientJson) => {
      const reshapedJson = {
        tools: [],
        agent: {
          name: "",
          role: "",
          tools: []
        },
        task_functions: [],
        tasks: [],
        flow_graph: {
          tasks: [],
          start_node: "",
          edges: []
        },
        conversation_manager: {
          conversation_id: "1",
          input: ""
        }
      };
  
      const nodeMap = {};

      clientJson.nodes.forEach(node => {
        const taskFunction = {
          name: node.data.taskName,
          steps: node.data.steps
        };
        reshapedJson.task_functions.push(taskFunction);
  
        const task = {
          name: node.data.taskName,
          function: node.data.taskName
        };
        reshapedJson.tasks.push(task);
  
        nodeMap[node.id] = node.data.taskName;
  
        const flowTask = {
          name: node.data.taskName,
          task: node.data.taskName
        };
        reshapedJson.flow_graph.tasks.push(flowTask);
  
        if (node.data.isStartNode) {
          reshapedJson.flow_graph.start_node = node.data.taskName;
        }
        node.data.steps?.forEach(step => {
          if (step.type === 'tool') {
            const toolName = step.tool_name;
            const tool = tools.find(t => t.name === toolName);
            if (tool && !reshapedJson.tools.some(t => t.name === tool.name)) {
              reshapedJson.tools.push(tool);
            }
          }
        });
  
        const agentName = node.data.agent;
        const agent = agents.find(a => a.name === agentName);
        if (agent) {
          reshapedJson.agent.name = agent.name;
          reshapedJson.agent.role = agent.role;
          reshapedJson.agent.tools = agent.tools;
        }
      });
  
      clientJson.edges.forEach(edge => {
        const reshapedEdge = {
          from: nodeMap[edge.source],
          to: nodeMap[edge.target]
        };
        reshapedJson.flow_graph.edges.push(reshapedEdge);
      });
  
      return reshapedJson;
    };
  
  const graphToJSON = () => {
    let graph = { nodes: [], edges: [] };
    nodes.forEach((node) => {
      // not returning the postion of the node {position: node.position}
      graph.nodes.push({ id: node.id ,data: node.data });
    });
    edges.forEach((edge) => {
      graph.edges.push({ source: edge.source, target: edge.target });
    });
    let x = reshapeJson(graph);
    return JSON.stringify(x, null, 2);
  }

  const checkIfGraphConnected = () => {

    if (nodes.length === 0) {
      return "Invalid - No nodes";
    }

    let visited = {};
    console.log(nodes)
    // check if there is only one start node and retrieve it
    const startNodes = nodes.filter((node) => node.data.isStartNode);
    if (startNodes.length > 1) {
      return "Invalid - Multiple start nodes";
    }
    const startNode = startNodes[0];

    if (!startNode) {
      return "Invalid - No start node";
    }

    if (!startNode) {
      return "Invalid - No start node";
    }

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
    if (Object.keys(visited).length === nodes.length){
      return graphToJSON()
    }
    return "invalid - graph not connected"
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

  return (
    <div className="Dashboard">
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
          {/* TO IMPLEMENT - generating workflows with prompt to llms based on JSON Schema */}
          {/* currently using fixed examples */}
          {/* <button className='generate-button' onClick={handleOpenGenWindow}>Generate</button> */}
          <button className='generate-button' onClick={() => setCurrentExampleIndex((currentExampleIndex+1)%4)}>Generate</button>
          <button className='build-button' onClick={()=> console.log(checkIfGraphConnected())}>Build</button>
        </div>
      </aside>
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
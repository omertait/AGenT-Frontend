import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import TopBar from './TopBar/TopBar';
import LandingPage from './LandingPage/LandingPage';
import Agents from './Agents/Agents';
import Tools from './Tools/Tools';
import {
  useNodesState,
  useEdgesState,
} from 'reactflow';
import examples from './Dashboard/ExamplesWorkflows.json';
import HelpPage from './Help/HelpPage';

function App() {
  const [ws, setWs] = useState(null);
  const [agents, setAgents] = useState([]);
  const [tools, setTools] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // keeping track of the current example index
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  // keeping track of the connection status to the server
  const [isConnected, setIsConnected] = useState(false);

  const generateLayout = (node, index) => {
    const baseX = 100; // Arbitrary starting position
    const baseY = 100; // Arbitrary starting position
    const spacing = 150; // Space between nodes

    return {
      ...node,
      position: { x: baseX + spacing * index, y: baseY + spacing * index }
    };
  };

  const loadWorkflow = (json) => {
    setAgents(json.agents || []);
    setTools(json.tools || []);
    const parsedNodes = (json.nodes || []).map((node, index) => generateLayout(node, index));
    // add ids to edges
    const parsedEdges = (json.edges || []).map((edge, index) => ({
      ...edge,
      id: index.toString()
    }));
    setNodes(parsedNodes);
    setEdges(parsedEdges);
  };

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8765");

    websocket.onopen = () => {
      setIsConnected(true);
      setWs(websocket);
    };

    websocket.onclose = () => {
      setIsConnected(false);
      setWs(null);
    };

    return () => {
      websocket.close();
    };
  }, []);


  useEffect(() => {
    const exampleJson = examples.workflows[currentExampleIndex];

    loadWorkflow(exampleJson);
  }, [currentExampleIndex]);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<>
          <TopBar active=''/>
          <LandingPage />
        </>} />
        <Route
          path="/Tasks"
          element={
            <>
              <TopBar active='Tasks'/>
              <Dashboard
               nodes={nodes}
               setNodes={setNodes}
               onNodesChange={onNodesChange}
               edges={edges}
               setEdges={setEdges}
               onEdgesChange={onEdgesChange}
               agents={agents}
               tools={tools}
               setCurrentExampleIndex={setCurrentExampleIndex}
               currentExampleIndex={currentExampleIndex}
               isConnected={isConnected}
               ws={ws}/>
            </>
          }
        />
        <Route
          path="/Agents"
          element={
            <>
              <TopBar active='Agents'/>
              <Agents agents={agents} setAgents={setAgents} tools={tools}/>
            </>
          }
        />
        <Route
          path="/Tools"
          element={
            <>
              <TopBar active='Tools'/>
              <Tools tools={tools} setTools={setTools} setAgents={setAgents} />
            </>
          }
        />
        <Route path="help" element={
          <>
            <TopBar active='Help'/>
            <HelpPage />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
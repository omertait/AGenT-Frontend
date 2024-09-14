import React, {useState} from 'react';
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

function App() {

  const [agents, setAgents] = useState([
    { id: 1, name: 'Assistent', role: 'Act as an assistant', tools: [] },
    { id: 2, name: 'John', role: 'Act as a Friend', tools: ['calculator'] },
  ]);

  const [tools, setTools] = useState([
    {
      name: "calculator",
      description: "calculates two numbers based on given operation (add/ subtract/ multiply/ divide)",
      parameters: [
        {
          name: "x",
          type: "int",
          description: "First number",
          required: true
        },
        {
          name: "y",
          type: "int",
          description: "Second number",
          required: true
        },
        {
          name: "operation",
          type: "string",
          description: "One of: add/ subtract/ multiply/ divide",
          required: true
        },
      ],
      function: `
def calculator_two_numbers(x, y, operation):
    if operation == \"add\":
        return x + y
    elif operation == \"subtract\":
        return x - y
    elif operation == \"multiply\":
        return x * y
    elif operation == \"divide\":
        return x / y
    else:
        return None
      `
    }
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
               tools={tools}/>
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
              <Tools tools={tools} setTools={setTools} />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
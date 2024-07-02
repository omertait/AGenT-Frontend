import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import TopBar from './TopBar';
import LandingPage from './LandingPage';
import Agents from './Agents';
import Tools from './Tools';

function App() {

  const [agents, setAgents] = useState([
    { id: 1, name: 'Agent 1', role: 'Assistant', tools: ['Web Search', 'Calculator'] },
    { id: 2, name: 'Agent 2', role: 'Researcher', tools: ['Web Search', 'Text Analysis'] },
  ]);

  const [tools, setTools] = useState([
    {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: [
        {
          name: "location",
          type: "string",
          description: "The city and state, e.g. San Francisco, CA",
          required: true
        },
        {
          name: "format",
          type: "string",
          description: "The temperature unit to use. Infer this from the user's location.",
          required: true
        }
      ],
      function: `
def get_current_weather(location, format):
    # Implementation details here
    pass
      `
    },
  ]);

  return (
    <Router>
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
              <Dashboard />
            </>
          }
        />
        <Route
          path="/Agents"
          element={
            <>
              <TopBar active='Agents'/>
              <Agents agents={agents} setAgents={setAgents}/>
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
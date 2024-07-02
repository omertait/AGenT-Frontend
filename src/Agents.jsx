import React, { useState } from 'react';
import './Agents.css';

const AgentsWindow = ({agents, setAgents}) => {
  const predefinedTools = ['Web Search', 'Calculator', 'Text Analysis', 'Image Recognition', 'Language Translation'];


  const [editingAgent, setEditingAgent] = useState(null);
  const [newAgent, setNewAgent] = useState({ name: '', role: '', tools: [] });

  const startEditing = (agent) => {
    setEditingAgent({ ...agent });
  };

  const cancelEditing = () => {
    setEditingAgent(null);
  };

  const saveAgent = () => {
    if (editingAgent) {
      setAgents(agents.map(agent => agent.id === editingAgent.id ? editingAgent : agent));
      setEditingAgent(null);
    } else {
      setAgents([...agents, { ...newAgent, id: agents.length + 1 }]);
      setNewAgent({ name: '', role: '', tools: [] });
    }
  };

  const deleteAgent = (id) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };

  const handleToolToggle = (tool, agentToUpdate) => {
    const updatedTools = agentToUpdate.tools.includes(tool)
      ? agentToUpdate.tools.filter(t => t !== tool)
      : [...agentToUpdate.tools, tool];

    if (editingAgent) {
      setEditingAgent({ ...editingAgent, tools: updatedTools });
    } else {
      setNewAgent({ ...newAgent, tools: updatedTools });
    }
  };

  const renderAgentForm = (agent, isNew = false) => (
    <div className="agent-form">
      <input
        type="text"
        value={agent.name}
        onChange={(e) => isNew ? setNewAgent({...newAgent, name: e.target.value}) : setEditingAgent({...editingAgent, name: e.target.value})}
        placeholder="Agent Name"
        className="input-field"
      />
      <input
        type="text"
        value={agent.role}
        onChange={(e) => isNew ? setNewAgent({...newAgent, role: e.target.value}) : setEditingAgent({...editingAgent, role: e.target.value})}
        placeholder="Agent Role"
        className="input-field"
      />
      <div className="tools-selection">
        {predefinedTools.map(tool => (
          <label key={tool} className="tool-checkbox">
            <input
              type="checkbox"
              checked={agent.tools.includes(tool)}
              onChange={() => handleToolToggle(tool, agent)}
            />
            {tool}
          </label>
        ))}
      </div>
      <button className="save-button" onClick={saveAgent}>
        {isNew ? 'Add Agent' : 'Save Changes'}
      </button>
      {!isNew && <button className="cancel-button" onClick={cancelEditing}>Cancel</button>}
    </div>
  );

  return (
    <div className="agents-window">
        <main>
            <h2>Agents</h2>
            {agents.length === 0 && <div style={{'display': 'flex', 'flexDirection':'column'}}>
                        <p>No Agents available. Add a new tool to get started</p>
            </div>}
            <div className="agents-list">
                {agents.map(agent => (
                <div key={agent.id} className="agent-item">
                    {editingAgent && editingAgent.id === agent.id ? (
                    renderAgentForm(editingAgent)
                    ) : (
                    <>
                        <div className="agent-info">
                        <h3>{agent.name}</h3>
                        <p>Role: {agent.role}</p>
                        <p>Tools: {agent.tools.length > 0 ? agent.tools.join(', ') : "None"}</p>
                        </div>
                        <div className="agent-actions">
                        <button className="edit-button" onClick={() => startEditing(agent)}>Edit</button>
                        <button className="delete-button" onClick={() => deleteAgent(agent.id)}>Delete</button>
                        </div>
                    </>
                    )}
                </div>
                ))}
            </div>
            <div className="add-new-agent">
                <h3>Add New Agent</h3>
                {renderAgentForm(newAgent, true)}
            </div>
      </main>
    </div>
    
  );
};

export default AgentsWindow;
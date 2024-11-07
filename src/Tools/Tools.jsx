import React, { useState } from 'react';
import './Tools.css';

const ToolsTab = ({tools, setTools, setAgents}) => {
  
  const [editingTool, setEditingTool] = useState(null);
  const [newTool, setNewTool] = useState({
    name: "",
    description: "",
    parameters: [],
    function: ""
  });
  const [expandedTools, setExpandedTools] = useState({});

  const toggleToolExpansion = (toolName) => {
    setExpandedTools(prev => ({
      ...prev,
      [toolName]: !prev[toolName]
    }));
  };

  const startEditing = (tool) => {
    setEditingTool({ ...tool });
  };

  const cancelEditing = () => {
    setEditingTool(null);
  };

  const saveTool = () => {
    const toolToSave = editingTool || newTool;
    if (editingTool) {
      setTools(tools.map(tool => tool.name === editingTool.name ? toolToSave : tool));
      setEditingTool(null);
    } else {
      setTools([...tools, toolToSave]);
      setNewTool({
        name: "",
        description: "",
        parameters: [],
        function: ""
      });
    }
  };

  const deleteTool = (name) => {
    setTools(tools.filter(tool => tool.name !== name));
    // remove tools from any agents that use it
    setAgents(agents => agents.map(agent => ({
      ...agent,
      tools: agent.tools.filter(tool => tool !== name)
    })));
  };

  const updateTool = (field, value, isNew = false) => {
    const updater = isNew ? setNewTool : setEditingTool;
    updater(prevTool => ({ ...prevTool, [field]: value }));
  };

  const updateParameter = (index, field, value, isNew = false) => {
    const updater = isNew ? setNewTool : setEditingTool;
    updater(prevTool => {
      const newParameters = [...prevTool.parameters];
      newParameters[index] = { ...newParameters[index], [field]: value };
      return { ...prevTool, parameters: newParameters };
    });
  };

  const addParameter = (isNew = false) => {
    const updater = isNew ? setNewTool : setEditingTool;
    updater(prevTool => ({
      ...prevTool,
      parameters: [...prevTool.parameters, { name: "", type: "", description: "", required: false }]
    }));
  };

  const removeParameter = (index, isNew = false) => {
    const updater = isNew ? setNewTool : setEditingTool;
    updater(prevTool => ({
      ...prevTool,
      parameters: prevTool.parameters.filter((_, i) => i !== index)
    }));
  };

  const renderToolForm = (tool, isNew = false) => (
    <div className="tool-form">
      <input
        type="text"
        value={tool.name}
        onChange={(e) => updateTool('name', e.target.value, isNew)}
        placeholder="Function Name"
        className="input-field"
      />
      <input
        type="text"
        value={tool.description}
        onChange={(e) => updateTool('description', e.target.value, isNew)}
        placeholder="Function Description"
        className="input-field"
      />
      <h4>Parameters:</h4>
      {tool.parameters.map((param, index) => (
        <div key={index} className="parameter-input">
          <input
            type="text"
            value={param.name}
            onChange={(e) => updateParameter(index, 'name', e.target.value, isNew)}
            placeholder="Parameter Name"
            className="input-field"
          />
          <input
            type="text"
            value={param.type}
            onChange={(e) => updateParameter(index, 'type', e.target.value, isNew)}
            placeholder="Parameter Type"
            className="input-field"
          />
          <input
            type="text"
            value={param.description}
            onChange={(e) => updateParameter(index, 'description', e.target.value, isNew)}
            placeholder="Parameter Description"
            className="input-field"
          />
          <label>
            <input
              type="checkbox"
              checked={param.required}
              onChange={(e) => updateParameter(index, 'required', e.target.checked, isNew)}
            />
            Required
          </label>
          <button className='delete-button' onClick={() => removeParameter(index, isNew)}>Remove</button>
        </div>
      ))}
      <button className='add-parameter-button' onClick={() => addParameter(isNew)}>Add Parameter</button>
      <textarea
        value={tool.function}
        onChange={(e) => updateTool('function', e.target.value, isNew)}
        placeholder="Python Function Code, e.g. def my_function(param1, param2):..."
        className="input-field function-input"
        rows="10"
      />
      <button className="save-button" onClick={saveTool}>
        {isNew ? 'Add Tool' : 'Save Changes'}
      </button>
      {!isNew && <button className="cancel-button" onClick={cancelEditing}>Cancel</button>}
    </div>
  );

  return (
    <div className="tools-window">
      <main>
        <h2>Tools</h2>
        {tools.length === 0 && <p>No tools available. Add a new tool to get started</p>}
        <div className="tools-list">
          {tools.map(tool => (
            <div key={tool.name} className="tool-item">
              <div className="tool-header" onClick={() => toggleToolExpansion(tool.name)}>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <button className="expand-button">
                  {expandedTools[tool.name] ? '▼' : '▶'}
                </button>
              </div>
              {expandedTools[tool.name] && (
                editingTool && editingTool.name === tool.name ? (
                  renderToolForm(editingTool)
                ) : (
                  <>
                    <div className="tool-info">
                      <h4>Parameters:</h4>
                      {tool.parameters.map((param, index) => (
                        <div key={index} className="parameter-info">
                          <p><strong>{param.name}</strong> ({param.type}): {param.description} {param.required ? '(Required)' : '(Optional)'}</p>
                        </div>
                      ))}
                      <h4>Python Function:</h4>
                      <pre className="function-preview">{tool.function}</pre>
                    </div>
                    <div className="tool-actions">
                      <button className="edit-button" onClick={() => startEditing(tool)}>Edit</button>
                      <button className="delete-button" onClick={() => deleteTool(tool.name)}>Delete</button>
                    </div>
                  </>
                )
              )}
            </div>
          ))}
        </div>
        <div className="add-new-tool">
          <h3>Add New Tool</h3>
          {renderToolForm(newTool, true)}
        </div>
      </main>
    </div>
  );
};

export default ToolsTab;
const reshapeJson = (clientJson, tools, agents) => {
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
          const toolName = step.tool;
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

const graphToJSON = (nodes, edges, tools, agents) => {
  let graph = { nodes: [], edges: [] };
  nodes.forEach((node) => {
    // not returning the postion of the node {position: node.position}
    graph.nodes.push({ id: node.id ,data: node.data });
  });
  edges.forEach((edge) => {
    graph.edges.push({ source: edge.source, target: edge.target });
  });
  let x = reshapeJson(graph, tools, agents);
  return JSON.stringify(x, null, 2);
}

const checkIfGraphConnected = (nodes, edges, tools, agents) => {
  if (nodes.length === 0) {
    return "Invalid - No nodes";
  }

  let visited = {};

  // check if there is only one start node and retrieve it
  const startNodes = nodes.filter((node) => node.data.isStartNode);
  if (startNodes.length > 1) {
    return [false,"Invalid - Multiple start nodes"];
  }
  const startNode = startNodes[0];

  if (!startNode) {
    return [false, "Invalid - No start node"];
  }

  if (!startNode) {
    return [false, "Invalid - No start node"];
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
    return [true, "valid"] //graphToJSON(nodes, edges, tools, agents);
  }
  return [false, "invalid - graph not connected"]
}


export { checkIfGraphConnected, graphToJSON, reshapeJson };
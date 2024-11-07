import React, { useEffect, useState } from "react";
import "./HelpPage.css";

const HelpPage = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".help-section");
      let currentSection = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120; // Offset for sticky header
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          currentSection = section.getAttribute("id");
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTOCClick = (event, id) => {
    event.preventDefault();
    const section = document.getElementById(id);
    const offset = 100; // Adjust scroll position for sticky header
    const topPosition = section.offsetTop - offset;
    window.scrollTo({
      top: topPosition,
      behavior: "smooth",
    });
  };

return (
    <div className="help-page">
        <header className="help-header">
            <div className="dot-grid"></div>
            <h1>AGent Help Center</h1>
            <p>
                Learn how to define agents, configure tools, create workflows, and manage tasks with our comprehensive guide.
            </p>
        </header>
        <div className="help-content-wrapper">
            <nav className="help-toc">
                <h3>Table of Contents</h3>
                <ul>
                    <li className={activeSection === "defining-agents" ? "active" : ""}>
                        <a href="#defining-agents" onClick={(e) => handleTOCClick(e, "defining-agents")}>
                            Defining Agents
                        </a>
                    </li>
                    <li className={activeSection === "defining-tools" ? "active" : ""}>
                        <a href="#defining-tools" onClick={(e) => handleTOCClick(e, "defining-tools")}>
                            Defining Tools
                        </a>
                    </li>
                    <li className={activeSection === "creating-workflow" ? "active" : ""}>
                        <a href="#creating-workflow" onClick={(e) => handleTOCClick(e, "creating-workflow")}>
                            Creating a Workflow
                        </a>
                    </li>
                    <li className={activeSection === "step-types" ? "active" : ""}>
                        <a href="#step-types" onClick={(e) => handleTOCClick(e, "step-types")}>
                            Step Types
                        </a>
                    </li>
                    <li className={activeSection === "update-memory" ? "active" : ""}>
                        <a href="#update-memory" onClick={(e) => handleTOCClick(e, "update-memory")}>
                            Update Memory
                        </a>
                    </li>
                    <li className={activeSection === "llm-interact" ? "active" : ""}>
                        <a href="#llm-interact" onClick={(e) => handleTOCClick(e, "llm-interact")}>
                            LLM Interact
                        </a>
                    </li>
                    <li className={activeSection === "tool" ? "active" : ""}>
                        <a href="#tool" onClick={(e) => handleTOCClick(e, "tool")}>
                            Tool
                        </a>
                    </li>
                    <li className={activeSection === "best-practices" ? "active" : ""}>
                        <a href="#best-practices" onClick={(e) => handleTOCClick(e, "best-practices")}>
                            Best Practices
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="help-content">
                <section id="defining-agents" className="help-section">
                    <h2>Defining Agents</h2>
                    <p>
                        Agents are virtual entities that execute tasks in workflows. To define an agent:
                    </p>
                    <ul>
                        <li>Go to the <strong>"Agents"</strong> tab and click <strong>"Add Agent"</strong>.</li>
                        <li>Provide a name and role for the agent (e.g., "Data Processor").</li>
                        <li>Attach relevant tools to the agent to enhance their capabilities.</li>
                    </ul>
                </section>

                <section id="defining-tools" className="help-section">
                    <h2>Defining Tools</h2>
                    <p>Tools perform specific operations such as calculations or text analysis. To define a tool:</p>
                    <ul>
                        <li>Navigate to the <strong>"Tools"</strong> tab and click <strong>"Add Tool"</strong>.</li>
                        <li>Provide the tool's name, description, and parameters.</li>
                        <li>Attach the tool to agents that will use it.</li>
                    </ul>
                </section>

                <section id="creating-workflow" className="help-section">
                    <h2>Creating a Workflow</h2>
                    <p>
                        To create a workflow, go to the <strong>"Tasks"</strong> tab and follow these steps:
                    </p>
                    <ol>
                        <li>Drag and drop predefined task templates onto the canvas.</li>
                        <li>Define or edit the tasks as needed.</li>
                        <li>Connect their nodes to establish a sequence.</li>
                        <li>Click the <strong>"Build"</strong> button to build the codebase for your project.</li>
                    </ol>
                </section>

                <section id="step-types" className="help-section">
                    <h2>Step Types</h2>
                    <p>Workflows consist of steps that define actions. There are three step types:</p>
                    <ol>
                        <li><strong>Update Memory:</strong> Stores data for reuse in subsequent steps.</li>
                        <li><strong>LLM Interact:</strong> Interacts with language models to process or generate text.</li>
                        <li><strong>Tool:</strong> Executes predefined tool functions dynamically.</li>
                    </ol>
                </section>

                <section id="update-memory" className="help-section">
                    <h2>Update Memory</h2>
                    <p>
                        The <code>update_memory</code> step stores the result of the previous step in memory.
                    </p>
                    <h3>Required Field</h3>
                    <ul>
                        <li><strong>memory_arg:</strong> A string key to store the value.</li>
                    </ul>
                    <h3>Example</h3>
                    <pre>
                        <code>
                            {`{
"type": "update_memory",
"memory_arg": "calculated_result"
}`}
                        </code>
                    </pre>
                </section>

                <section id="llm-interact" className="help-section">
                    <h2>LLM Interact</h2>
                    <p>
                        The <code>llm_interact</code> step sends a prompt to a language model to process data or generate responses.
                    </p>
                    <h3>Required Fields</h3>
                    <ul>
                        <li><strong>promptTemplate:</strong> A string with placeholders for dynamic data.</li>
                        <li><strong>model:</strong> The language model to use (e.g., "gpt-4o").</li>
                    </ul>
                    <h3>Special Keywords for Prompts</h3>
                    <ul>
                        <li><strong>{`{task_input}`}</strong>: The input passed to the task. If this is the first task, it refers to the user input.</li>
                        <li><strong>{`{last_step_result}`}</strong>: The result from the last step. Avoid using it if it's the first step (it will be `None`).</li>
                        <li><strong>{`{memory}`}</strong>: The memory object for the workflow.</li>
                        <li><strong>{`{memory["<key>"]}`}</strong>: Access specific memory values, e.g., `memory["calculated_result"]`.</li>
                        <li><strong>{`{memory["user_input"]}`}</strong>: The user's initial input that triggered the workflow.</li>
                        <li><strong>{`{memory["conversation_history"]}`}</strong>: The list of all conversation messages.</li>
                    </ul>
                    <h3>Example</h3>
                    <pre>
                        <code>
                            {`{
"type": "llm_interact",
"promptTemplate": "Explain: {task_input}",
"model": "gpt-4o"
}`}
                        </code>
                    </pre>
                </section>

                <section id="tool" className="help-section">
                    <h2>Tool</h2>
                    <p>
                        The <code>tool</code> step dynamically executes predefined tool functions.
                    </p>
                    <h3>Required Fields</h3>
                    <ul>
                        <li><strong>tool:</strong> Name of the tool to execute.</li>
                        <li><strong>input_data_func:</strong> Expression defining the tool's input data.</li>
                    </ul>
                    <h3>Example</h3>
                    <pre>
                        <code>
                            {`{
"type": "tool",
"tool": "calculator",
"input_data_func": {
    "x": "{last_step_result}",
    "y": 2,
    "operation": "add"
}
}`}
                        </code>
                    </pre>
                    <section>
                        <h3>Syntax with Tools</h3>
                        <p>
                            The <code>input_data_func</code> field makes input generation dynamic and flexible. Instead of writing a full function, users provide only the expression.
                        </p>
                        <h4>What You Write</h4>
                        <pre>
                            <code>
                                {`{
"x": "{last_step_result}",
"y": 2,
"operation": "add"
}`}
                            </code>
                        </pre>
                        <h4>Backend Interpretation</h4>
                        <pre>
                            <code>
                                {`lambda task_input, last_step_result, memory: eval(
"{\"x\": int(task_input), \"y\": 2, \"operation\": \"add\"}",
{'task_input': task_input, 'last_step_result': last_step_result, 'memory': memory}
)`}
                            </code>
                        </pre>
                    </section>
                </section>

                <section id="best-practices" className="help-section">
                    <h2>Best Practices</h2>
                    <ul>
                        <li>Use dynamic prompts to create flexible workflows.</li>
                        <li>Ensure proper error handling, especially in initial steps.</li>
                        <li>Strategically store intermediate results using <code>update_memory</code>.</li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
);
};

export default HelpPage;

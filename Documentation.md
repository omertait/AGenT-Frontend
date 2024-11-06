# Workflow Builder Documentation

Welcome to the Workflow Builder! This document provides detailed instructions and examples for using the three available step types: **update_memory**, **llm_interact**, and **tool**. Each step type plays a unique role in building dynamic, intelligent workflows. Follow the examples below to learn how to use these features effectively.

---

## Step Types Overview

1. **update_memory**: Stores data from the last step or task to be reused later.
2. **llm_interact**: Interacts with a language model (LLM) using a custom prompt.
3. **tool**: Executes a predefined tool function with dynamically generated input data.

---

## 1. **update_memory**

The `update_memory` step allows you to store the result of the previous step or task in memory for future use.

### **Required Field**
- `memory_arg`: A string defining the key name to store the value.

### **Example**
```json
{
  "type": "update_memory",
  "memory_arg": "calculated_result"
}
```

This step saves the last step's result in `memory["calculated_result"]`. You can reference this memory in subsequent steps, such as in `llm_interact` or `tool`.

---

## 2. **llm_interact**

The `llm_interact` step interacts with a language model using a custom prompt.

### **Required Fields**
- `promptTemplate`: A string with placeholders for dynamic data.
- `model`: The LLM to use. Options: `"gpt-4o"`, `"gpt-4o-mini"`.

### **Special Keywords for Prompts**
- `{task_input}`: The input passed to the task. If this is the first task, it refers to the user input.
- `{last_step_result}`: The result from the last step. Avoid using it if it's the first step (it will be `None`).
- `{memory}`: The memory object for the workflow.
- `{memory["<key>"]}`: Access specific memory values, e.g., `memory["calculated_result"]`.
- `{memory["user_input"]}`: The user's initial input that triggered the workflow.
- `{memory["conversation_history"]}`: The list of all conversation messages.

### **Example**
```json
{
  "type": "llm_interact",
  "promptTemplate": "Act as a private tutor and respond to the following: {task_input}\n\nContext:\nLast answer: {last_step_result}",
  "model": "gpt-4o-mini"
}
```

This step sends a prompt to the model. The `{task_input}` refers to the initial user input, and `{last_step_result}` provides the result from the last step.

---

## 3. **tool**

The `tool` step executes a predefined tool with input data generated dynamically.

### **Required Fields**
- `tool`: The name of the tool to execute.
- `input_data_func`: An expression that defines the tool's input data. You can reference:
  - `task_input`
  - `last_step_result`
  - `memory` (e.g., `memory["key"]`)

### **Example**
```json
{
  "type": "tool",
  "tool": "calculator",
  "input_data_func": {
    "x": "{last_step_result}",
    "y": 2,
    "operation": "add"
  }
}
```

This step uses the `calculator` tool with dynamic input:
- `x`: The result of the last step.
- `y`: A static value (`2`).
- `operation`: Specifies the action (`add`).

---

## Full Workflow Example: **Performing a Calculation**

Here's a complete workflow that calculates the sum of two numbers and stores the result in memory.

### JSON Definition
```json
{
  "nodes": [
    {
      "id": "node1",
      "type": "llm_interact",
      "data": {
        "isStartNode": true,
        "taskName": "User Input",
        "steps": [
          {
            "type": "llm_interact",
            "promptTemplate": "You are a calculator bot. Please take this input and parse it: {task_input}",
            "model": "gpt-4o"
          }
        ]
      }
    },
    {
      "id": "node2",
      "type": "tool",
      "data": {
        "taskName": "Perform Calculation",
        "steps": [
          {
            "type": "tool",
            "tool": "calculator",
            "input_data_func": {
              "x": "{last_step_result}",
              "y": 2,
              "operation": "add"
            }
          }
        ]
      }
    },
    {
      "id": "node3",
      "type": "update_memory",
      "data": {
        "taskName": "Store Result",
        "steps": [
          {
            "type": "update_memory",
            "memory_arg": "calculated_result"
          }
        ]
      }
    },
    {
      "id": "node4",
      "type": "llm_interact",
      "data": {
        "taskName": "Explain Calculation",
        "steps": [
          {
            "type": "llm_interact",
            "promptTemplate": "The result of the calculation is {memory['calculated_result']}. Explain this to the user.",
            "model": "gpt-4o-mini"
          }
        ]
      }
    }
  ],
  "edges": [
    { "source": "node1", "target": "node2" },
    { "source": "node2", "target": "node3" },
    { "source": "node3", "target": "node4" }
  ]
}
```

### Workflow Steps
1. **Node 1 (`llm_interact`)**:
   - Parses user input using LLM.
   - Example prompt: `"You are a calculator bot. Please take this input and parse it: {task_input}"`.

2. **Node 2 (`tool`)**:
   - Uses the `calculator` tool to perform an addition operation.
   - Example input: `{"x": 5, "y": 2, "operation": "add"}` (dynamic from `last_step_result`).

3. **Node 3 (`update_memory`)**:
   - Stores the result of the calculation in `memory["calculated_result"]`.

4. **Node 4 (`llm_interact`)**:
   - Uses the stored result to explain the calculation to the user.
   - Example prompt: `"The result of the calculation is {memory['calculated_result']}. Explain this to the user."`.

---

## Best Practices

1. **Dynamic Prompts**:
   - Use special keywords (`{task_input}`, `{last_step_result}`, etc.) to build flexible and reusable workflows.

2. **Error Handling**:
   - Avoid using `{last_step_result}` in the first step, as it will be `None`.

3. **Memory Management**:
   - Use `update_memory` strategically to save intermediate results for future reference.

## Syntax with Tools
The `input_data_func` field is designed to make input data generation for tools dynamic and flexible. Instead of requiring a full function definition, users only need to provide the **expression** as they would write it inside a lambda function.

This abstraction means you don't need to write boilerplate code. The backend will wrap the provided expression into a lambda function dynamically during execution. For example:

#### **What You Write**
```json
"{\"x\": int(task_input), \"y\": 2, \"operation\": \"add\"}"
```

#### **How the Backend Interprets It**
The backend automatically wraps your expression like this:
```python
lambda task_input, last_step_result, memory: eval(
    "{\"x\": int(task_input), \"y\": 2, \"operation\": \"add\"}",
    {'task_input': task_input, 'last_step_result': last_step_result, 'memory': memory}
)
```

This allows the user to focus only on the logic required for generating the input data while the backend handles execution.

---

### **Key Points for Users**
1. **Expression-Based Writing**:
   - Write only the part that creates or manipulates the input data, such as:
     ```json
     "{\"x\": int(last_step_result), \"y\": 2, \"operation\": \"add\"}"
     ```

2. **Dynamic Variables**:
   - You can reference:
     - `task_input` for the initial task input.
     - `last_step_result` for the output of the last step.
     - `memory` for stored values (e.g., `memory['key']`).

3. **Simple Syntax**:
   - Avoid writing a full function; the backend dynamically handles it. You only provide the core logic for the `input_data_func`.
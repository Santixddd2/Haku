🧠 Haku — AI Flow Orchestration Framework Based on Finite State Machines
🚀 Overview

Haku is an experimental framework for orchestrating artificial intelligence workflows using finite state machines (FSMs) as execution controllers.

The system allows defining non-deterministic finite automata (NFA) that coordinate multiple specialized AI agents.
The long-term goal is to collapse these execution paths into a single optimal execution state (feature currently under development).

Haku explores how formal computational models can be combined with modern AI systems to build more structured and controllable software generation pipelines.

🧩 Framework Architecture

Haku is composed of three main modules:

🔁 Translator

Transforms the user prompt into a structured sequence that can be consumed by the predefined finite automaton.
This module bridges natural language input with formal computational decision flows.

🤖 Agents

Defines the individual agents participating in the system, each with:

A specific task responsibility
An associated large language model accessed via the Groq API
Agents can specialize in tasks such as:

Code generation
File management
Semantic analysis

🧭 Orchestrator

Integrates:

The translator output
The automaton structure
The selected agents
And builds the full execution flow, coordinating transitions between states and accumulating outputs into a shared global state.

🎯 Project Goals

Haku aims to explore the integration of:
Formal computation models (automata theory)
Multi-agent systems
Large language models
To build more controllable, reproducible and structured AI-driven software pipelines, compared to purely sequential prompt-based approaches.
The framework is open-source, experimental, and designed to be extensible by introducing new computational models and data structures that can converge toward optimal execution states.

🛠 Quick Start (Basic Usage)

1. Define the automaton structure
   ```
   structure = {
    "q0": {
        0: [["code", "", "q1"]],
        1: [["file", "", "q1"]]
    },
    "q1": {
        1: [["", "file", "End"]]
    }
    }  
   ```
Each transition defines:
Which part of the global state is updated
Which agent is triggered
The next automaton state


2. Define agents and models
   ```
   Agents = {
    "File Management": ["files.py", "llama3-70b-8192"],
    "Code Generation": ["", "qwen-2.5-coder-32b"],
   }
   ```
Each agent is associated with:
A tool or module (optional)
A specific LLM model

3. Initialize components
   ```
   translator = Translator(...)
   automata = AIAutomata(StateClass, structure, model, examples)
   orchestrator = HakuOrchestrator(translator, structure, automata)
   ```

4. Execute the workflow
   ```
   graph, alerts, translation = orchestrator.executeFlow(prompt, attempts=3)
   result = graph.compile().invoke(...)
   ```
The system executes multiple AI agents following the automaton transitions and aggregates their outputs.

⚠️ Project Status

This project is experimental and under active development.
Some components may require refactoring and improved documentation.

The current implementation focuses on architectural experimentation rather than production-ready deployment.


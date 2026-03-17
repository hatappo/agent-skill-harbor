---
name: prompt-engineering
description: "Design effective prompts for LLM-powered features. Use when building AI-assisted features, chatbots, or agent systems."
metadata:
  tags: ai, prompts, llm, prompt-engineering, agents
---

Structure prompts with clear separation between system instructions, context, and user input. The system prompt should define the assistant's role, capabilities, constraints, and output format expectations. Place static instructions and reference material early in the context window where attention is strongest, and put the dynamic user query or task description at the end. Use XML tags or markdown headers to delineate sections clearly, making it easier for the model to parse structured inputs and reducing ambiguity about which part of the prompt contains instructions versus data.

Apply few-shot examples strategically to demonstrate the desired output format, reasoning style, and edge case handling. Include 2-5 examples that cover the most common cases and at least one edge case or negative example showing what the model should not do. For complex reasoning tasks, use chain-of-thought prompting by instructing the model to work through its reasoning step by step before providing a final answer. When building agentic systems, define available tools with clear descriptions, parameter schemas, and usage examples so the model can select the appropriate tool and construct valid invocations.

Evaluate prompt effectiveness systematically rather than relying on anecdotal testing. Build evaluation datasets with input-output pairs covering expected behavior, edge cases, and adversarial inputs. Measure quality metrics appropriate to the task — accuracy for classification, BLEU/ROUGE for generation, tool-call correctness for agents. Version control your prompts alongside application code and track performance metrics across prompt versions. When iterating, change one aspect at a time (instruction wording, example selection, output format) to isolate the impact of each modification. Set temperature and other sampling parameters based on the task requirements: low temperature (0-0.3) for deterministic factual tasks, moderate (0.5-0.7) for creative generation with consistency.

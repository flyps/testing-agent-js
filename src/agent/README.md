# Baserun demo

This is a small app that uses LangChain to demonstrate Baserun.

## Walkthrough

### Setup

Install dependencies
```bash
npm install
```

Create a .env file with at least two environment variables: `BASERUN_API_KEY` and `OPENAI_API_KEY`

### Execute the main.ts script

```bash
ts-node src/agent/main.ts
```

If passed without arguments it will prompt you for a task. You can pass an argument for the task if you wish:

```bash
ts-node src/agent/main.ts "tell me the capital of the united states"
```

### It will prompt you for what you want to do

```
What would you like me to do?
> Tell me the capital of the united states
```

## After this step everything is automatic

After you provide input you can sit back and watch it accomplish its task.

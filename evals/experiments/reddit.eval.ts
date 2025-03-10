import { runLLM } from '../../src/llm'
import { redditToolDefinition } from '../../src/tools/reddit'
import { runEval } from '../evalTools'
import { TollCallMatch } from '../scorers'

const createToolCallMessage = (toolName: string) => ({
  role: 'assistant' as const,
  tool_calls: [
    {
      type: 'function' as const,
      id: '1',
      function: {
        name: toolName,
        arguments: '',
      },
    },
  ],
  content: null,
  refusal: null,
})

runEval('reddit', {
  task: (input: string) =>
    runLLM({
      messages: [
        {
          role: 'user',
          content: input,
        },
      ],
      tools: [redditToolDefinition],
    }),
  data: [
    {
      input: 'find me something interesting on reddit',
      expected: createToolCallMessage(redditToolDefinition.name),
    },
    {
      input: 'hi',
      expected: createToolCallMessage(redditToolDefinition.name),
    },
  ],
  scorers: [TollCallMatch],
})

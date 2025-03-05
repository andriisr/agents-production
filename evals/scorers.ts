import type { Scorer } from 'autoevals'
import type { AIMessage, ToolAssistantMessage } from '../types'

export const TollCallMatch: Scorer<
  AIMessage,
  {
    expected: ToolAssistantMessage
  }
> = async ({ output, expected }) => {
  const score =
    output.role === 'assistant' &&
    Array.isArray(output.tool_calls) &&
    output.tool_calls.length === 1 &&
    output.tool_calls[0].function.name === expected.tool_calls![0].function.name
      ? 1
      : 0

  return {
    name: 'TollCallMatch',
    score,
  }
}

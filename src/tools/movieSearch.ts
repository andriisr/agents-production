import { z } from 'zod'
import type { ToolFn } from '../../types'
import { queryMovies } from '../rag/query'

export const movieSearchToolDefinition = {
  name: 'moviewSearch',
  parameters: z.object({
    query: z
      .string()
      .describe('The query to use for search in a vector database'),
  }),
  description:
    'Use this tool to search for movies and answer question about them, line rating, budget, actors, genre, etc.',
}

type Args = z.infer<typeof movieSearchToolDefinition.parameters>

export const movieSearch: ToolFn<Args, string> = async ({ toolArgs }) => {
  let movies
  try {
    movies = await queryMovies({
      query: toolArgs.query,
    })
  } catch (e) {
    console.error(e)
    return `Error querying movies from the database`
  }

  const result = movies.map((movie) => ({
    ...movie.metadata,
    description: movie.data,
  }))

  return JSON.stringify(result, null, 2)
}

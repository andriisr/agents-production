import { Index } from '@upstash/vector'

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
})

type MovieMetadata = {
  title?: string
  year?: string
  genre?: string
  director?: string
  actors?: string
  rating?: string
  votes?: string
  revenue?: string
  metascore?: string
}

export const queryMovies = async ({
  query,
  topK = 5,
}: {
  query: string
  filters?: Partial<MovieMetadata>
  topK?: number
}) => {
  const filterStr = ''
  return index.query({
    data: query,
    topK,
    filter: filterStr || undefined,
    includeData: true,
    includeMetadata: true,
  })
}

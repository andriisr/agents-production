import 'dotenv/config'
import { Index } from '@upstash/vector'
import ora from 'ora'
import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse/sync'

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
})

const indexMovieData = async () => {
  const spinner = ora('Reading movie data...').start()

  const dataPath = path.join(process.cwd(), 'src/rag/imdb_movie_dataset.csv')
  const data = fs.readFileSync(dataPath, 'utf8')
  const movies = parse(data, {
    columns: true,
    skip_empty_lines: true,
  })

  spinner.text = 'Starting movie indexing...'

  // for (const movie of movies.slice(0, 10)) {
  //   spinner.text = `Indexing movie ${movie.Title}...`
  //   const text = `${movie.Title}. ${movie.Gnere}. ${movie.Description}`

  //   try {
  //     await index.upsert({
  //       id: movie.Title,
  //       data: text,
  //       metadata: {
  //         title: movie.Title,
  //         year: Number(movie.Year),
  //         genre: movie.Genre,
  //         director: movie.Director,
  //         actors: movie.Actors,
  //         rating: Number(movie.Rating),
  //         votes: Number(movie.Votes),
  //         revenue: Number(movie['Revenue (Millions)']),
  //         metascore: Number(movie.Metascore),
  //       },
  //     })
  //   } catch (e) {
  //     spinner.text = `Error indexing movie ${movie.Title}`
  //     console.error(e)
  //   }
  // }

  try {
    const formattedMovies = movies.map((movie: any) => {
      return {
        id: movie.Title,
        data: `${movie.Title}. ${movie.Genre}. ${movie.Description}`,
        metadata: {
          title: movie.Title,
          year: Number(movie.Year),
          genre: movie.Genre,
          director: movie.Director,
          actors: movie.Actors,
          rating: Number(movie.Rating),
          votes: Number(movie.Votes),
          revenue: Number(movie['Revenue (Millions)']),
          metascore: Number(movie.Metascore),
        },
      }
    })

    await index.upsert(formattedMovies)
  } catch (e) {
    spinner.text = `Error indexing movies`
    console.error(e)
  }

  spinner.succeed('Movie indexing complete!')
}

indexMovieData()

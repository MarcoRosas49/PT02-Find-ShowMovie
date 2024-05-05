import { useRef, useState, useMemo } from 'react'
import { searchMovies } from '../services/movies'

export function useMovies ({search, sort}) {

    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const previousSearch = useRef(search)


    const getMovies = useMemo(() => {
      return async() => {

        if( search === previousSearch.current) return
  
        try {
          setLoading(true)
          setError(null)
          previousSearch.current = search
          const newMovies = await searchMovies({ search })
          setMovies(newMovies)
          setLoading(false)
          
        } catch (error) {
          setError(error.message)
        } finally {
          setLoading(false)
        }
      }
    },[search]) 
  
    //const getSortedMovies = sort ? [...movies].sort((a,b) => a.title.localeCompare(b.title)) : movies

    //se usa el useMemo cuando se cambia la dependencia de sort y cuando se cambian las peliculas
    const sortedMovies = useMemo(() => {
      return sort 
      ? [...movies].sort((a,b) => a.title.localeCompare(b.title)) 
      : movies
    },[sort, movies]) 
  
    return {movies: sortedMovies, getMovies, loading}
  }
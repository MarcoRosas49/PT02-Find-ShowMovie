import { useRef, useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'

export function useMovies ({search, sort}) {

    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null)
    const previousSearch = useRef(search)

    //useCallback solo se usa para las funciones
    //useMemo para cualquier cosa (como constantes o funciones)
    const getMovies = useCallback(async({search}) => {

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
      
    },[]) 
  
    //se usa el useMemo cuando se cambia la dependencia de sort y cuando se cambian las peliculas
    const sortedMovies = useMemo(() => {
      return sort 
      ? [...movies].sort((a,b) => a.title.localeCompare(b.title)) 
      : movies
    },[sort, movies]) 
  
    return {movies: sortedMovies, getMovies, loading}
  }
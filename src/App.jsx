import { useState, useEffect, useRef } from 'react'
import './App.css'
import { Movies } from './components/Movies.jsx'
import { useMovies } from './hooks/useMovies.js'


function useSearch () {

  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {

    if(isFirstInput.current){
     isFirstInput.current = search === ''
     return
    }  

    if(search === ''){
      setError('No se puede buscar una pelicula vacia')
      return
    }

    if(search.match(/^\d+$/)){
      setError('No se puede buscar una pelicula con un numero')
      return
    }
    if(search.length <= 3){
      setError('La búsqueda debe tener más de 3 carácteres')
      return
    }

    setError(null)
  }, [search])

  return {search, setSearch, error}
}


function App() {

  const [sort, setSort] = useState(false)

  const { search, setSearch, error } = useSearch()
  const { movies, loading,  getMovies } = useMovies({search, sort})

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({search})
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
    getMovies({search: newSearch})
  }

  const handleSort = () => {
    setSort(!sort)
  }


  return (
    <div className='page'>

      <header>
        <h1>Buscador de Peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input onChange={handleChange} value={search} name='search' placeholder='Avengers, Star wars, the matrix ...' />
          <input type='checkbox' onChange={handleSort} checked={sort} />

          <button type='submit'>Buscar</button>
        </form>

        {error && <p style={ {color: 'red'}}>{error}</p>}

      </header>

      <main>
        {
          loading ? <p>Cargando ...</p> : <Movies movies={movies}/>
        }
      </main>


    </div>
  )
}

export default App

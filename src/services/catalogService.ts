import { state } from '../state.js';
import { showSkeletons, showToast, updateHeroBanner, filterAndRenderMovies, renderGrid } from '../ui/render.js';

// Configuración de OMDb API
const API_KEY = '121725aa';
const BASE_URL = 'https://www.omdbapi.com/';

const INITIAL_MOVIE_IDS = [
    'tt3896198', 'tt0816692', 'tt1375666', 'tt0468569', 'tt1877830',
    'tt10872600', 'tt1160419', 'tt0133093', 'tt0111161', 'tt2397461'
];

const MOCK_MOVIES = [
    {
        id: 'tt3896198', name: 'Guardians of the Galaxy Vol. 2', genres: ['Action', 'Adventure', 'Comedy'], rating: { average: '7.6' }, runtime: 136,
        image: { original: 'https://m.media-amazon.com/images/M/MV5BNjM0NTc0NzItM2FlYS00NzEwLWE5MTUtNGE5EWEzNWU3MzE5XkEyXkFqcGdeQXVyNTgwNzIyNzg@._V1_SX300.jpg' },
        summary: '<p>The Guardians must fight to keep their newfound family together as they unravel the mystery of Peter Quill\'s true parentage.</p>', year: '2017'
    },
    {
        id: 'tt0816692', name: 'Interstellar', genres: ['Drama', 'Sci-Fi'], rating: { average: '8.7' }, runtime: 169,
        image: { original: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg' },
        summary: '<p>A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.</p>', year: '2014'
    }
];

export async function fetchMovies() {
    showSkeletons();
    try {
        const moviePromises = INITIAL_MOVIE_IDS.map(id =>
            fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`).then(res => res.json())
        );
        const results = await Promise.all(moviePromises);
        const validResults = results.filter(item => item.Response === "True");

        if (validResults.length === 0) throw new Error("API Limit Reached");

        state.movies = validResults.map(item => ({
            id: item.imdbID, name: item.Title, year: item.Year,
            genres: item.Genre ? item.Genre.split(', ') : ['Action'],
            rating: { average: item.imdbRating !== 'N/A' ? item.imdbRating : '7.5' },
            runtime: item.Runtime !== 'N/A' ? parseInt(item.Runtime) : 110,
            image: { original: item.Poster !== 'N/A' ? item.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop' },
            summary: item.Plot !== 'N/A' ? `<p>${item.Plot}</p>` : '<p>Sinopsis no disponible.</p>'
        }));
    } catch (err) {
        console.warn('Usando datos de prueba:', err);
        state.movies = MOCK_MOVIES;
        showToast('API Ocupada - Usando datos locales', 'fa-triangle-exclamation', 'text-amber-400');
    }

    if (state.movies.length > 0) updateHeroBanner(state.movies[0]);
    filterAndRenderMovies();
}

export function fetchMoviesByGenreSimulado(genero) {
    console.log('\ud83c\udf10 Cache MISS - consultando servicio para', genero);

    return new Promise((resolve) => {
        setTimeout(() => {
            if (genero === 'all') {
                resolve(state.movies);
                return;
            }

            const filtradas = state.movies.filter(movie =>
                movie.genres.some(g => g.toLowerCase().includes(genero.toLowerCase()))
            );
            resolve(filtradas);
        }, 600);
    });
}

export async function searchMoviesFromOMDb(query) {
    showSkeletons();
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
        const data = await response.json();

        if (data.Response === "True" && data.Search) {
            const detailPromises = data.Search.slice(0, 8).map(item =>
                fetch(`${BASE_URL}?apikey=${API_KEY}&i=${item.imdbID}`).then(res => res.json())
            );
            const detailedResults = await Promise.all(detailPromises);

            state.filteredMovies = detailedResults
                .filter(item => item.Response !== "False")
                .map(item => ({
                    id: item.imdbID, name: item.Title, year: item.Year,
                    genres: item.Genre ? item.Genre.split(', ') : ['Action'],
                    rating: { average: item.imdbRating !== 'N/A' ? item.imdbRating : '7.5' },
                    runtime: item.Runtime !== 'N/A' ? parseInt(item.Runtime) : 110,
                    image: { original: item.Poster !== 'N/A' ? item.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop' },
                    summary: `<p>${item.Plot || 'N/A'}</p>`
                }));
        } else {
            state.filteredMovies = []; // No se encontró nada
        }
    } catch (err) {
        // Fallback a búsqueda local si la API falla
        state.filteredMovies = state.movies.filter(movie =>
            movie.name.toLowerCase().includes(query.toLowerCase())
        );
    }
    renderGrid();
}

import type { MovieDTO } from '../dtos/movies.dto.js';
import type { Movie } from '../entities/movies.entity.js';
import { mapMovieDtoToEntity } from '../mappers/movies.mapper.js';
import { state } from '../state.js';
import { showSkeletons, showToast, updateHeroBanner, filterAndRenderMovies, renderGrid } from '../ui/render.js';

const API_KEY = '121725aa';
const BASE_URL = 'https://www.omdbapi.com/';

const INITIAL_MOVIE_IDS = [
    'tt3896198', 'tt0816692', 'tt1375666', 'tt0468569', 'tt1877830',
    'tt10872600', 'tt1160419', 'tt0133093', 'tt0111161', 'tt2397461'
];

const MOCK_MOVIES: Movie[] = [
    {
        id: 'tt3896198', title: 'Guardians of the Galaxy Vol. 2', genre: 'Action, Adventure, Comedy', rating: 7.6, runtime: '136 min',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BNjM0NTc0NzItM2FlYS00NzEwLWE5MTUtNGE5EWEzNWU3MzE5XkEyXkFqcGdeQXVyNTgwNzIyNzg@._V1_SX300.jpg',
        plot: '<p>The Guardians must fight to keep their newfound family together as they unravel the mystery of Peter Quill\'s true parentage.</p>', year: 2017
    },
    {
        id: 'tt0816692', title: 'Interstellar', genre: 'Drama, Sci-Fi', rating: 8.7, runtime: '169 min',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
        plot: '<p>A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.</p>', year: 2014
    }
];

export async function fetchMovies(): Promise<Movie[]> {
    showSkeletons();
    try {
        const moviePromises = INITIAL_MOVIE_IDS.map(id =>
            fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`).then(res => res.json() as Promise<MovieDTO>)
        );
        const results: MovieDTO[] = await Promise.all(moviePromises);
        const validResults = results.filter(item => item.Response === "True");

        if (validResults.length === 0) throw new Error("API Limit Reached");

        state.movies = validResults.map(mapMovieDtoToEntity);
    } catch (err) {
        console.warn('Usando datos de prueba:', err);
        state.movies = MOCK_MOVIES;
        showToast('API Ocupada - Usando datos locales', 'fa-triangle-exclamation', 'text-amber-400');
    }

    if (state.movies.length > 0) updateHeroBanner(state.movies[0]);
    filterAndRenderMovies();
    return state.movies;
}

export function fetchMoviesByGenreSimulado(genero: string): Promise<Movie[]> {
    console.log('\ud83c\udf10 Cache MISS - consultando servicio para', genero);

    return new Promise<Movie[]>((resolve) => {
        setTimeout(() => {
            if (genero === 'all') {
                resolve(state.movies);
                return;
            }

            const filtradas = state.movies.filter(movie =>
                movie.genre.split(', ').some((g: string) => g.toLowerCase().includes(genero.toLowerCase()))
            );
            resolve(filtradas);
        }, 600);
    });
}

export async function searchMoviesFromOMDb(query: string): Promise<Movie[]> {
    showSkeletons();
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
        const data = await response.json();

        if (data.Response === "True" && data.Search) {
            const detailPromises = data.Search.slice(0, 8).map((item: { imdbID: string }) =>
                fetch(`${BASE_URL}?apikey=${API_KEY}&i=${item.imdbID}`).then(res => res.json() as Promise<MovieDTO>)
            );
            const detailedResults: MovieDTO[] = await Promise.all(detailPromises);

            state.filteredMovies = detailedResults
                .filter(item => item.Response !== "False")
                .map(mapMovieDtoToEntity);
        } else {
            state.filteredMovies = [];
        }
    } catch (err) {
        state.filteredMovies = state.movies.filter(movie =>
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
    }
    renderGrid();
    return state.filteredMovies;
}

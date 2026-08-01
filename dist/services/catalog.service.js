import { state } from '../state.js';
const API_KEY = '121725aa';
const BASE_URL = 'https://www.omdbapi.com/';
const INITIAL_MOVIE_IDS = [
    'tt3896198', 'tt0816692', 'tt1375666', 'tt0468569', 'tt1877830',
    'tt10872600', 'tt1160419', 'tt0133093', 'tt0111161', 'tt2397461'
];
export async function getMovies() {
    const moviePromises = INITIAL_MOVIE_IDS.map(id => fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`).then(res => res.json()));
    const results = await Promise.all(moviePromises);
    const validResults = results.filter(item => item.Response === "True");
    if (validResults.length === 0)
        throw new Error("API Limit Reached");
    return validResults;
}
export function getMoviesByGenre(genero) {
    console.log('\ud83c\udf10 Cache MISS - consultando servicio para', genero);
    return new Promise((resolve) => {
        setTimeout(() => {
            if (genero === 'all') {
                resolve(state.movies);
                return;
            }
            const filtradas = state.movies.filter(movie => movie.genre.split(', ').some((g) => g.toLowerCase().includes(genero.toLowerCase())));
            resolve(filtradas);
        }, 600);
    });
}
export async function searchMovies(query) {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data = await response.json();
    if (data.Response === "True" && data.Search) {
        const detailPromises = data.Search.slice(0, 8).map((item) => fetch(`${BASE_URL}?apikey=${API_KEY}&i=${item.imdbID}`).then(res => res.json()));
        const detailedResults = await Promise.all(detailPromises);
        return detailedResults.filter(item => item.Response !== "False");
    }
    return [];
}

import type { Movie } from './entities/movies.entity.js';

export const state = {
    language: 'es',
    movies: [] as Movie[],
    filteredMovies: [] as Movie[],
    favorites: new Set<string>(),
    selectedSeats: new Set<number>(),
    ticketPrice: 8.50,
    activeFilter: 'all',
    searchQuery: ''
};

// Estado global compartido de la aplicación.
// Se exporta como `const` porque el objeto nunca se REASIGNA:
// los demás módulos mutan sus propiedades (state.movies = ..., state.language = ...)
// y, gracias a los "live bindings" de ESM, todos los módulos que lo importan
// ven siempre la misma referencia actualizada.
export const state = {
    language: 'es', // Idioma por defecto
    movies: [],
    filteredMovies: [],
    favorites: new Set(),
    selectedSeats: new Set(),
    ticketPrice: 8.50,
    activeFilter: 'all',
    searchQuery: ''
};

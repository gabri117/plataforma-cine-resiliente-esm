import { state } from '../state.js';

// DICCIONARIO DE TRADUCCIONES (i18n)
export const i18n = {
    es: {
        searchPlaceholder: "Buscar película o género...",
        favorites: "Favoritos",
        featured: "Estreno Destacado",
        buyTickets: "Comprar Entradas",
        moreInfo: "Más Info",
        all: "Todas", action: "Acción", drama: "Drama", comedy: "Comedia", scifi: "Ciencia Ficción",
        loadingCatalog: "Cargando catálogo...",
        noMovies: "No se encontraron películas",
        tryAdjusting: "Prueba ajustando los términos de búsqueda o filtros.",
        footerRights: "© 2026 Todos los derechos reservados.",
        terms: "Términos y Condiciones", privacy: "Privacidad",
        synopsis: "Sinopsis", save: "Guardar", bookTickets: "Reservar Boletos", buy: "Comprar",
        seatSelection: "Selección de Asientos", screen: "PANTALLA", available: "Disponible",
        selected: "Seleccionado", occupied: "Ocupado", totalPay: "Total a pagar:",
        confirmPurchase: "Confirmar Compra",
        moviesFound: "películas encontradas", moviesShowing: "películas en cartelera"
    },
    en: {
        searchPlaceholder: "Search movie or genre...",
        favorites: "Favorites",
        featured: "Featured Release",
        buyTickets: "Buy Tickets",
        moreInfo: "More Info",
        all: "All", action: "Action", drama: "Drama", comedy: "Comedy", scifi: "Sci-Fi",
        loadingCatalog: "Loading catalog...",
        noMovies: "No movies found",
        tryAdjusting: "Try adjusting your search terms or filters.",
        footerRights: "© 2026 All rights reserved.",
        terms: "Terms and Conditions", privacy: "Privacy",
        synopsis: "Synopsis", save: "Save", bookTickets: "Book Tickets", buy: "Buy",
        seatSelection: "Seat Selection", screen: "SCREEN", available: "Available",
        selected: "Selected", occupied: "Occupied", totalPay: "Total to pay:",
        confirmPurchase: "Confirm Purchase",
        moviesFound: "movies found", moviesShowing: "movies showing"
    }
};

// Mapeo para traducir géneros de la API (que vienen en inglés)
export const genreTranslations = {
    'Action': 'Acción', 'Adventure': 'Aventura', 'Comedy': 'Comedia',
    'Sci-Fi': 'Ciencia Ficción', 'Drama': 'Drama', 'Thriller': 'Suspenso',
    'Horror': 'Terror', 'Animation': 'Animación', 'Family': 'Familiar'
};

// Helper de traducción
export function t(key: string): string {
    return (i18n as Record<string, Record<string, string>>)[state.language]?.[key] || key;
}

export function translateGenre(genre: string): string {
    if (state.language === 'en') return genre;
    return (genreTranslations as Record<string, string>)[genre] || genre;
}

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
const FALLBACK_PLOT = '<p>Sinopsis no disponible.</p>';
export class MovieMapper {
    static toDomain(raw) {
        const rating = parseFloat(raw.imdbRating) || 0;
        return {
            id: raw.imdbID,
            title: raw.Title,
            year: parseInt(raw.Year, 10) || 0,
            rating,
            genre: raw.Genre,
            plot: raw.Plot && raw.Plot !== 'N/A' ? raw.Plot : FALLBACK_PLOT,
            runtime: raw.Runtime,
            posterUrl: raw.Poster !== 'N/A' ? raw.Poster : FALLBACK_POSTER,
            isTopRated: rating >= 8,
        };
    }
    static sanitizePartial(raw) {
        const hasRating = raw.imdbRating !== undefined && raw.imdbRating !== null && raw.imdbRating !== '';
        const rating = hasRating ? parseFloat(raw.imdbRating) || 0 : 0;
        const update = {
            title: raw.Title ?? 'TÍTULO NO DISPONIBLE',
            year: raw.Year !== undefined && raw.Year !== null && raw.Year !== ''
                ? parseInt(raw.Year, 10) || 2026
                : 2026,
            rating: hasRating ? rating : 0,
            genre: raw.Genre ?? 'Sin género',
            plot: raw.Plot && raw.Plot !== 'N/A' ? raw.Plot : FALLBACK_PLOT,
            runtime: raw.Runtime ?? 'N/A',
            posterUrl: raw.Poster && raw.Poster !== 'N/A' ? raw.Poster : FALLBACK_POSTER,
            isTopRated: hasRating ? rating >= 8 : false,
        };
        return update;
    }
    static toSummary(movie) {
        return {
            id: movie.id,
            title: movie.title,
        };
    }
}

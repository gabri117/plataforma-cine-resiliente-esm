import type { MovieRawDTO } from '../dtos/movies.dto.js';
import type { Movie } from '../entities/movies.entity.js';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
const FALLBACK_PLOT = '<p>Sinopsis no disponible.</p>';

export class MovieMapper {
  static toDomain(raw: MovieRawDTO): Movie {
    return {
      id: raw.imdbID,
      title: raw.Title,
      year: parseInt(raw.Year, 10) || 0,
      rating: parseFloat(raw.imdbRating) || 0,
      genre: raw.Genre,
      plot: raw.Plot && raw.Plot !== 'N/A' ? raw.Plot : FALLBACK_PLOT,
      runtime: raw.Runtime,
      posterUrl: raw.Poster !== 'N/A' ? raw.Poster : FALLBACK_POSTER,
    };
  }
}

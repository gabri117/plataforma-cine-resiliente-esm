import type { MovieDTO } from '../dtos/movies.dto.js';
import type { Movie } from '../entities/movies.entity.js';

export function mapMovieDtoToEntity(dto: MovieDTO): Movie {
  return {
    id: dto.imdbID,
    title: dto.Title,
    year: parseInt(dto.Year, 10) || 0,
    rating: parseFloat(dto.imdbRating) || 0,
    genre: dto.Genre,
    plot: dto.Plot,
    runtime: dto.Runtime,
    posterUrl: dto.Poster,
  };
}

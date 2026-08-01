export function mapMovieDtoToEntity(dto) {
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

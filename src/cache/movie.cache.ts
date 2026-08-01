import type { Movie } from '../entities/movies.entity.js';

export function crearFiltroPeliculas(fetchFn: (genero: string) => Promise<Movie[]>) {
    const cache: Record<string, Movie[]> = {};

    return {
        async filtrarPorGenero(genero: string): Promise<Movie[]> {
            if (cache[genero] !== undefined) {
                console.log('\u2705 Cache HIT');
                return cache[genero];
            }

            const resultado = await fetchFn(genero);
            cache[genero] = resultado;
            return resultado;
        }
    };
}

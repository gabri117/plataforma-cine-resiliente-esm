export function crearFiltroPeliculas(fetchFn) {
    const cache = {};
    return {
        async filtrarPorGenero(genero) {
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

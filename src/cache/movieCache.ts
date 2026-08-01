export function crearFiltroPeliculas(fetchFn) {
    const cache = {};

    return {
        async filtrarPorGenero(genero) {
            if (cache[genero] !== undefined) {
                console.log('✅ Cache HIT');
                return cache[genero];
            }

            const resultado = await fetchFn(genero);
            cache[genero] = resultado;
            return resultado;
        }
    };
}

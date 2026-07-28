export async function fetchReviews() {
    const delay = Math.random() * 500 + 500;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.4) {
                reject(new Error('Fallo en servicio de Reseñas'));
            } else {
                resolve([
                    { user: 'María G.', comment: 'Excelente película, la fotografía es impresionante.', stars: 5 },
                    { user: 'Carlos R.', comment: 'Buena trama, aunque el final pudo ser mejor.', stars: 4 },
                    { user: 'Ana L.', comment: 'Entretenida, perfecta para ver en familia.', stars: 4 },
                    { user: 'Pedro M.', comment: 'No me convenció del todo, actuaciones regulares.', stars: 3 },
                    { user: 'Lucía F.', comment: 'Una obra maestra, la volvería a ver sin duda.', stars: 5 }
                ]);
            }
        }, delay);
    });
}

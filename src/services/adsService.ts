export async function fetchAds() {
    const delay = Math.random() * 500 + 500;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.4) {
                reject(new Error('Fallo en servicio de Anuncios'));
            } else {
                resolve([
                    { promo: '2x1 en combo gigante', discount: '50% OFF' },
                    { promo: 'Martes de CineMax: Entradas a mitad de precio', discount: '50% OFF' }
                ]);
            }
        }, delay);
    });
}

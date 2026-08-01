import type { AdRawDTO } from '../dtos/ads.dto.js';

export async function getAds(): Promise<AdRawDTO[]> {
    const delay = Math.random() * 500 + 500;

    return new Promise<AdRawDTO[]>((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.4) {
                reject(new Error('Fallo en servicio de Anuncios'));
            } else {
                resolve([
                    { promo_description: '2x1 en combo gigante', discount_percentage: '50% OFF' },
                    { promo_description: 'Martes de CineMax: Entradas a mitad de precio', discount_percentage: '50% OFF' }
                ]);
            }
        }, delay);
    });
}

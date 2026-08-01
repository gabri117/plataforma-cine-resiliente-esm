import type { AdDTO } from '../dtos/ads.dto.js';
import type { Ad } from '../entities/ads.entity.js';
import { mapAdDtoToEntity } from '../mappers/ads.mapper.js';

export async function fetchAds(): Promise<Ad[]> {
    const delay = Math.random() * 500 + 500;

    return new Promise<Ad[]>((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.4) {
                reject(new Error('Fallo en servicio de Anuncios'));
            } else {
                const dtos: AdDTO[] = [
                    { promo: '2x1 en combo gigante', discount: '50% OFF' },
                    { promo: 'Martes de CineMax: Entradas a mitad de precio', discount: '50% OFF' }
                ];
                resolve(dtos.map(mapAdDtoToEntity));
            }
        }, delay);
    });
}

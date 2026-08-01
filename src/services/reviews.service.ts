import type { ReviewRawDTO } from '../dtos/reviews.dto.js';

export async function getReviews(): Promise<ReviewRawDTO[]> {
    const delay = Math.random() * 500 + 500;

    return new Promise<ReviewRawDTO[]>((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.4) {
                reject(new Error('Fallo en servicio de Reseñas'));
            } else {
                resolve([
                    { reviewer_name: 'María G.', review_comment_raw: 'Excelente película, la fotografía es impresionante.', star_count: 5 },
                    { reviewer_name: 'Carlos R.', review_comment_raw: 'Buena trama, aunque el final pudo ser mejor.', star_count: 4 },
                    { reviewer_name: 'Ana L.', review_comment_raw: 'Entretenida, perfecta para ver en familia.', star_count: 4 },
                    { reviewer_name: 'Pedro M.', review_comment_raw: 'No me convenció del todo, actuaciones regulares.', star_count: 3 },
                    { reviewer_name: 'Lucía F.', review_comment_raw: null, star_count: 5 }
                ]);
            }
        }, delay);
    });
}

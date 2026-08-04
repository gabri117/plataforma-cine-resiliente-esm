export class ReviewMapper {
    static toDomain(raw) {
        return {
            user: raw.reviewer_name,
            comment: raw.review_comment_raw ?? 'Sin comentarios.',
            stars: raw.star_count,
            isPositive: raw.star_count >= 4,
        };
    }
    static sanitizePartial(raw) {
        const hasStars = raw.star_count !== undefined && raw.star_count !== null;
        const stars = hasStars ? Number(raw.star_count) || 0 : 0;
        const update = {
            user: raw.reviewer_name ?? 'USUARIO ANÓNIMO',
            comment: raw.review_comment_raw ?? 'Sin comentarios.',
            stars: hasStars ? stars : 0,
            isPositive: hasStars ? stars >= 4 : false,
        };
        return update;
    }
}

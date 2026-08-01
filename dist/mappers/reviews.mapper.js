export class ReviewMapper {
    static toDomain(raw) {
        return {
            user: raw.reviewer_name,
            comment: raw.review_comment_raw ?? 'Sin comentarios.',
            stars: raw.star_count,
            isPositive: raw.star_count >= 4,
        };
    }
}

import type { ReviewRawDTO } from '../dtos/reviews.dto.js';
import type { Review } from '../entities/reviews.entity.js';

export class ReviewMapper {
  static toDomain(raw: ReviewRawDTO): Review {
    return {
      user: raw.reviewer_name,
      comment: raw.review_comment_raw ?? 'Sin comentarios.',
      stars: raw.star_count,
      isPositive: raw.star_count >= 4,
    };
  }
}

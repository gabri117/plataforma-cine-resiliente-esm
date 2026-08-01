import type { ReviewDTO } from '../dtos/reviews.dto.js';
import type { Review } from '../entities/reviews.entity.js';

export function mapReviewDtoToEntity(dto: ReviewDTO): Review {
  return {
    user: dto.user,
    comment: dto.comment,
    stars: dto.stars,
  };
}

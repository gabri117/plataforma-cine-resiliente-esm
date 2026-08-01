import type { AdRawDTO } from '../dtos/ads.dto.js';
import type { Ad } from '../entities/ads.entity.js';

export class AdMapper {
  static toDomain(raw: AdRawDTO): Ad {
    return {
      promo: raw.promo_description ?? '',
      discount: raw.discount_percentage,
      isActive: raw.promo_description != null && raw.promo_description.length > 0,
    };
  }
}

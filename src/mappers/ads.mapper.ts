import type { AdDTO } from '../dtos/ads.dto.js';
import type { Ad } from '../entities/ads.entity.js';

export function mapAdDtoToEntity(dto: AdDTO): Ad {
  return {
    promo: dto.promo,
    discount: dto.discount,
  };
}

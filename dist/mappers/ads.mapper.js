export class AdMapper {
    static toDomain(raw) {
        return {
            promo: raw.promo_description ?? '',
            discount: raw.discount_percentage,
            isActive: raw.promo_description != null && raw.promo_description.length > 0,
        };
    }
}

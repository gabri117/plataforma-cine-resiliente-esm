export class AdMapper {
    static toDomain(raw) {
        return {
            promo: raw.promo_description ?? '',
            discount: raw.discount_percentage,
            isActive: raw.promo_description != null && raw.promo_description.length > 0,
        };
    }
    static sanitizePartial(raw) {
        const hasPromo = raw.promo_description !== undefined &&
            raw.promo_description !== null &&
            raw.promo_description !== '';
        const promo = hasPromo ? String(raw.promo_description) : 'PROMOCIÓN NO DISPONIBLE';
        const hasDiscount = raw.discount_percentage !== undefined && raw.discount_percentage !== null;
        const update = {
            promo,
            discount: hasDiscount ? String(raw.discount_percentage) : '0',
            isActive: hasPromo,
        };
        return update;
    }
}

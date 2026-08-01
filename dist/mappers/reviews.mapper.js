export function mapReviewDtoToEntity(dto) {
    return {
        user: dto.user,
        comment: dto.comment,
        stars: dto.stars,
    };
}

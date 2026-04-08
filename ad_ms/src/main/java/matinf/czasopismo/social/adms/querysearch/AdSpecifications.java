package matinf.czasopismo.social.adms.querysearch;

import matinf.czasopismo.social.adms.data.Ad;
import org.springframework.data.jpa.domain.Specification;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class AdSpecifications {

    public static Specification<Ad> userId(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }

    public static Specification<Ad> userIdIn(List<UUID> userIds) {
        return (root, query, cb) -> root.get("userId").in(userIds);
    }

    public static Specification<Ad> updatedAfter(OffsetDateTime from) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("updatedAt"), from);
    }

    public static Specification<Ad> updatedBefore(OffsetDateTime to) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("updatedAt"), to);
    }

    public static Specification<Ad> categoriesIn(List<UUID> categories) {
        return (root, query, cb) -> root.get("categoryId").in(categories);
    }

    public static Specification<Ad> keyword(String keyword) {
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("content")), "%" + keyword.toLowerCase() + "%")
        );
    }

}

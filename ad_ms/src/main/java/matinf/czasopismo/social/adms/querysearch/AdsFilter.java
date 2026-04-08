package matinf.czasopismo.social.adms.querysearch;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record AdsFilter(
        UUID user,
        OffsetDateTime from,
        OffsetDateTime to,
        List<UUID> users,
        List<UUID> categories,
        String keyword
) {}

package matinf.czasopismo.social.adms.data;

import java.util.UUID;

public record UserFeignDto(
        String name,
        UUID uuid
) {}


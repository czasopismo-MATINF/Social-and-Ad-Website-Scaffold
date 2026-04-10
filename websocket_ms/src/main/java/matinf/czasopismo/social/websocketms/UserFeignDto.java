package matinf.czasopismo.social.websocketms;

import java.util.UUID;

public record UserFeignDto(
        String name,
        UUID uuid
) {}


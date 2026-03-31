package matinf.czasopismo.social.adms.data;

import java.util.UUID;

public record UserDto(
        String name,
        UUID uuid
) {}


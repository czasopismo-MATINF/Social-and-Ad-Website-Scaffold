package matinf.czasopismo.social.gateway_ms.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "cors")
@Data
public class CorsProperties {
    private List<String> corsOrigins;
    private String allowedHeader;
    private String allowedMethod;
}

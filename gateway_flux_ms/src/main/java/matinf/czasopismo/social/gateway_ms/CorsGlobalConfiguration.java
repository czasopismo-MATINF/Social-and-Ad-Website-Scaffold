package matinf.czasopismo.social.gateway_ms;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.gateway_ms.config.CorsProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
@EnableConfigurationProperties(CorsProperties.class)
@Slf4j
@RequiredArgsConstructor
public class CorsGlobalConfiguration {

    private final CorsProperties corsProperties;

    @Bean
    public CorsWebFilter corsWebFilter() {

        log.info("Cors Origins: {}", this.corsProperties.getCorsOrigins().toString());
        log.info("Cors Header: {}", this.corsProperties.getAllowedHeader());
        log.info("Cors Method: {}", this.corsProperties.getAllowedMethod());

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(this.corsProperties.getCorsOrigins());
        config.addAllowedHeader(this.corsProperties.getAllowedHeader());
        config.addAllowedMethod(this.corsProperties.getAllowedMethod());
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}

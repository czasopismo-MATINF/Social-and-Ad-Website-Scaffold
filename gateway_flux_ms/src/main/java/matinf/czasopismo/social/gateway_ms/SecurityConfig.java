package matinf.czasopismo.social.gateway_ms;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${management.server.port}")
    private String actuatorPort;

    @Bean
    @Order(1)
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/ads").permitAll()
                        .pathMatchers(HttpMethod.GET, "/categories").permitAll()
                        .pathMatchers("/websocket-ms/**").permitAll()
                        //.pathMatchers("/actuator/**").permitAll()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(ServerHttpSecurity.OAuth2ResourceServerSpec::jwt)
                .build();
    }

    // Security dla portu management.server.port (Actuator) — całkowicie odbezpieczony wewnątrz sieci wewnętrznej docker-compose
    @Bean
    @Order(0)
    public SecurityWebFilterChain actuatorSecurity(ServerHttpSecurity http) {
        return http
                .securityMatcher(new PortSecurityMatcher(Integer.valueOf(this.actuatorPort)))
                .authorizeExchange(exchanges -> exchanges
                        .anyExchange().permitAll()
                )
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .build();
    }

}



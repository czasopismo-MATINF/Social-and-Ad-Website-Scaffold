package matinf.czasopismo.social.gateway_ms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class WebSocketAuthFilterGatewayFilterFactory
        extends AbstractGatewayFilterFactory<WebSocketAuthFilterGatewayFilterFactory.Config> {

    private final JwtService jwtService;

    public WebSocketAuthFilterGatewayFilterFactory(JwtService jwtService) {
        super(Config.class);
        this.jwtService = jwtService;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            String token = extractJwtFromQuery(exchange);

            if (token == null || !validate(token)) {
                return unauthorized(exchange);
            }

            return chain.filter(exchange);
        };
    }

    public static class Config {
        // puste – nie potrzebujesz parametrów
    }

    private String extractJwtFromQuery(ServerWebExchange exchange) {
        return exchange.getRequest()
                .getQueryParams()
                .getFirst("token");
    }

    private boolean validate(String token) {
        try {
            return jwtService.validateToken(token);
        } catch (Exception e) {
            return false;
        }
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}

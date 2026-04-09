/*
package matinf.czasopismo.social.gateway_ms;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

//@Component
public class WebSocketAuthFilter implements GatewayFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String token = extractJwtFromQuery(exchange);

        if (token == null || !validate(token)) {
            return unauthorized(exchange);
        }

        return chain.filter(exchange);
    }

    private boolean validate(String token) {
        try {
            //TODO:
            //return jwtService.validateToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    private String extractJwtFromQuery(ServerWebExchange exchange) {
        return exchange.getRequest()
                .getQueryParams()
                .getFirst("token");
    }
    
}
 */

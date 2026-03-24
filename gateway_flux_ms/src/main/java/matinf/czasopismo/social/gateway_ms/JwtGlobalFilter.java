package matinf.czasopismo.social.gateway_ms;

import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class JwtGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String auth = exchange.getRequest().getHeaders().getFirst("Authorization");

        if (auth != null && auth.startsWith("Bearer ")) {

            //log.info("Parsing JWT in JwtGlobalFilter {}", auth);

            try {

                String token = auth.substring(7);

                SignedJWT jwt = SignedJWT.parse(token);
                var claims = jwt.getJWTClaimsSet();

                String userId = claims.getSubject();
                String username = claims.getStringClaim("preferred_username");

                ServerHttpRequest mutated = exchange.getRequest().mutate()
                        .header("X-User-Id", userId)
                        .header("X-Username", username)
                        .build();

                return chain.filter(exchange.mutate().request(mutated).build());

            } catch (Exception e) {
                //log.error("Exception in JwtGlobalFilter {}", e.toString());
                return chain.filter(exchange);
            }
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }

}


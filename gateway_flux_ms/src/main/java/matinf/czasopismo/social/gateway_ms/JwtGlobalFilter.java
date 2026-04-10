package matinf.czasopismo.social.gateway_ms;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Base64;

@Component
@Slf4j
public class JwtGlobalFilter implements GlobalFilter, Ordered {

    private final boolean LOG = false;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                // Parsowanie nagłówka i payload bez weryfikacji podpisu
                String[] parts = token.split("\\.");
                String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));

                if(LOG) log.info("JWT payload: {}", payloadJson);

                // Wyciągnięcie iss
                JsonNode payload = new ObjectMapper().readTree(payloadJson);
                String iss = payload.get("iss").asText();

                if(LOG) log.info("JWT iss claim = {}", iss);

            } catch (Exception e) {
                if(LOG) log.error("Failed to decode JWT", e);
            }
        }

        String auth = exchange.getRequest().getHeaders().getFirst("Authorization");

        if (auth != null && auth.startsWith("Bearer ")) {

            if(LOG) log.info("Parsing JWT in JwtGlobalFilter {}", auth);

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
                if(LOG) log.error("Exception in JwtGlobalFilter {}", e.toString());
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


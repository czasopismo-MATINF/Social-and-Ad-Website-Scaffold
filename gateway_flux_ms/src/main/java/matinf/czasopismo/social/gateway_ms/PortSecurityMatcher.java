package matinf.czasopismo.social.gateway_ms;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public class PortSecurityMatcher implements ServerWebExchangeMatcher {

    private final int port;

    public PortSecurityMatcher(int port) {
        this.port = port;
    }

    @Override
    public Mono<MatchResult> matches(ServerWebExchange exchange) {
        ServerHttpRequest request = exchange.getRequest();
        int requestPort = request.getURI().getPort();

        if (requestPort == port) {
            return MatchResult.match();
        } else {
            return MatchResult.notMatch();
        }
    }

}

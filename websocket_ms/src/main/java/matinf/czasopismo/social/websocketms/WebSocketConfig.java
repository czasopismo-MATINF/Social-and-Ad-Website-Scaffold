package matinf.czasopismo.social.websocketms;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Dokąd serwer będzie wysyłał wiadomości do klientów
        config.enableSimpleBroker("/topic", "/queue");
        // Prefiks dla endpointów, na które klient wysyła wiadomości do aplikacji
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/websocket-ms")
                .setAllowedOriginPatterns("*");
        // .withSockJS(); // jeśli chcesz SockJS
    }

}

package matinf.czasopismo.social.websocketms;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserPrincipalInterceptor implements ChannelInterceptor {

    private final UserFeignClient userClient;

    private final boolean LOG = false;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            //String token = accessor.getFirstNativeHeader("token");
            String token = (String) accessor.getSessionAttributes().get("token");

            log.info("Token pobrany z sesji: {}.", token);

            // 🔥 NIE walidujesz podpisu, bo zrobił to Gateway
            // 🔥 tylko dekodujesz payload
            String[] parts = token.split("\\.");
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));

            JsonNode payload = null;
            try {
                payload = new ObjectMapper().readTree(payloadJson);
                String userId = payload.get("sub").asText();
                String username = payload.get("preferred_username").asText();

                UserFeignDto user = this.userClient.getUser(username);

                if(LOG) log.info("Użytkownik {}, {} połączony.", username, user.uuid().toString());

                accessor.setUser(new StompPrincipal(user.uuid().toString(), username));
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }

        }

        return message;
    }
}

package matinf.czasopismo.social.websocketms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class ChatWebSocketController {

    private final ChatKafkaProducer producer;

    public ChatWebSocketController(ChatKafkaProducer producer) {
        this.producer = producer;
    }

    /*
    @MessageMapping("/chat.send")
    public void handleChatMessage(@Payload ChatMessage message) {
        log.info("Klient przesłał czat wiadomość: {}.", message.toString());
        producer.send(message);
    }
    */

    @MessageMapping("/test.send")
    public void handleChatMessage(@Payload TestMessage message) {
        log.info("Klient przesłał testową czat wiadomość: {}.", message.toString());
        producer.send(message);
    }

}

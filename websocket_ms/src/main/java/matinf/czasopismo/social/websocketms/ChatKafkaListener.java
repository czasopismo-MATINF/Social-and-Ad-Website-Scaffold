package matinf.czasopismo.social.websocketms;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatKafkaListener {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatKafkaListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "chat.messages", groupId = "chat-service")
    public void onMessage(ChatMessage message) {
        // np. /topic/room.123
        String destination = "/topic/room.123";
        messagingTemplate.convertAndSend(destination, message);
    }

    @KafkaListener(topics = "test.messages", groupId = "chat-service")
    public void onMessage(TestMessage message) {
        String destination = "/topic/room.123";
        messagingTemplate.convertAndSend(destination, message);
    }

}

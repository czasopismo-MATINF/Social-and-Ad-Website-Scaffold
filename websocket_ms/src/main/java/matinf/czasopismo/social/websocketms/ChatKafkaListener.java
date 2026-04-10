package matinf.czasopismo.social.websocketms;

import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.chatms.kafka.ChatMessage;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ChatKafkaListener {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatKafkaListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "chat.messages", groupId = "chat-service")
    public void onMessage(ChatMessage message) {
        //log.info("Wysyłam wiadomość do frontendu do użytkownika: {}.", message.getTo());
        messagingTemplate.convertAndSendToUser(message.getTo().toString(), "/queue/private", message);
        messagingTemplate.convertAndSendToUser(message.getFrom().toString(), "/queue/private", message);
    }

    @KafkaListener(topics = "test.messages", groupId = "chat-service")
    public void onMessage(TestMessage message) {
        String destination = "/topic/room.123";
        messagingTemplate.convertAndSend(destination, message);
    }

}

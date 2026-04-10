package matinf.czasopismo.social.chatms.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatKafkaProducer {

    private final KafkaTemplate<String, ChatMessage> kafkaTemplate;

    public void send(ChatMessage message) {
        kafkaTemplate.send("chat.messages", "roomId", message);
    }

}

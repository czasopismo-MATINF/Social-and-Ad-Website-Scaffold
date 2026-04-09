package matinf.czasopismo.social.websocketms;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatKafkaProducer {

    private final KafkaTemplate<String, ChatMessage> kafkaTemplate;
    private final KafkaTemplate<String, TestMessage> kafkaTestTemplate;

    public void send(ChatMessage message) {
        kafkaTemplate.send("chat.messages", "roomId", message);
    }

    public void send(TestMessage message) {
        kafkaTestTemplate.send("test.messages", "roomId", message);
    }

}

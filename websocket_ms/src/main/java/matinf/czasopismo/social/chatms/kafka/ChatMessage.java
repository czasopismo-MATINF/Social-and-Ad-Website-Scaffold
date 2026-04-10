package matinf.czasopismo.social.chatms.kafka;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ChatMessage {

    private UUID id;
    private UUID from;
    private UUID to;
    private UUID conversationId;
    private String content;
    private OffsetDateTime createdAt;

}

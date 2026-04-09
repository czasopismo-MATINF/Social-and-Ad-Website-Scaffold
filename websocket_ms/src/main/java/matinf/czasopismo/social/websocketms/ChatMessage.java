package matinf.czasopismo.social.websocketms;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ChatMessage {

    private UUID from;
    private UUID to;
    private UUID conversationId;
    private String content;
    private Instant createdAt;

}

package matinf.czasopismo.social.chatms.services;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.chatms.data.*;
import matinf.czasopismo.social.chatms.kafka.ChatKafkaProducer;
import matinf.czasopismo.social.chatms.kafka.ChatMessage;
import org.apache.kafka.common.KafkaException;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessagesService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository conversationParticipantRepository;

    private final ChatKafkaProducer producer;

    @Transactional
    public void sendNewMessage(
            @NotNull @Valid UUID from,
            @NotNull @Valid UUID to,
            @NotNull @Size(min = 1) String content
    ) {
        // 1. Znajdź istniejącą konwersację (AND filter)
        List<UUID> participants = List.of(from, to);

        List<Conversation> existing = conversationRepository.findConversationsByParticipants(
                participants,
                participants.size()
        );

        Conversation conversation;

        if (existing.isEmpty()) {
            // 2. Jeśli brak — utwórz nową konwersację
            conversation = Conversation.builder()
                    .createdAt(OffsetDateTime.now())
                    .updatedAt(OffsetDateTime.now())
                    .build();

            conversation = conversationRepository.save(conversation);

            // 3. Dodaj uczestników
            ConversationParticipant p1 = ConversationParticipant.builder()
                    .id(new ConversationParticipantId(conversation.getId(), from))
                    .conversation(conversation)
                    .build();

            ConversationParticipant p2 = ConversationParticipant.builder()
                    .id(new ConversationParticipantId(conversation.getId(), to))
                    .conversation(conversation)
                    .build();

            conversationParticipantRepository.save(p1);
            conversationParticipantRepository.save(p2);

        } else {
            // 4. Jeśli istnieje — użyj jej
            conversation = existing.get(0);
            conversation.setUpdatedAt(OffsetDateTime.now());
            conversationRepository.save(conversation);
        }

        // 5. Zapisz wiadomość
        Message message = Message.builder()
                .conversation(conversation)
                .senderId(from)
                .content(content)
                .createdAt(OffsetDateTime.now())
                .build();

        try {
            this.producer.send(
                    ChatMessage.builder()
                            .from(from)
                            .to(to)
                            .conversationId(conversation.getId())
                            .content(message.getContent())
                            .createdAt(message.getCreatedAt()).build());
        } catch(KafkaException ignored) {

        }

        messageRepository.save(message);
    }


}

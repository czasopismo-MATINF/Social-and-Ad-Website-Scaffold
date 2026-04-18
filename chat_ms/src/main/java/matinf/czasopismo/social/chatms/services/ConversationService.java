package matinf.czasopismo.social.chatms.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.chatms.data.*;
import matinf.czasopismo.social.chatms.exceptions.UserNotAuthorizedException;
import matinf.czasopismo.social.chatms.kafka.ChatKafkaProducer;
import matinf.czasopismo.social.chatms.kafka.ChatMessage;
import matinf.czasopismo.social.chatms.mappers.ConversationMapper;
import matinf.czasopismo.social.chatms.model.ConversationPage;
import matinf.czasopismo.social.chatms.model.SendMessageRequest;
import matinf.czasopismo.social.chatms.model.SendMessageRequestWithoutTo;
import org.apache.kafka.common.KafkaException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ConversationMapper conversationMapper;

    private final ChatKafkaProducer producer;

    @Transactional
    public List<Conversation> getConversations(List<UUID> participants, Integer number, OffsetDateTime before) {

        if(before != null) {
            return conversationRepository.findConversationsByParticipantsBefore(
                    participants,
                    participants.size(),
                    number,
                    before
            );
        } else {
            return conversationRepository.findConversationsByParticipantsBefore(
                    participants,
                    participants.size(),
                    number
            );
        }

    }

    @Transactional
    public ConversationPage getConversation(UUID id, Boolean withMessages, UUID uuid, String user, OffsetDateTime before, Integer number) {

        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(String.format("Conversation %s not found.", id)));

        if(conversation.getParticipants().stream().filter(p -> p.getId().getUserId().equals(uuid)).findAny().isEmpty()) {
            throw new UserNotAuthorizedException(String.format("User %s not authorized to view this conversation.", user));
        }

        List<Message> messages = new LinkedList<>();

        if (withMessages) {

            if(before == null) {
                if(number == null || number <= 0) {
                    //
                } else {
                    messages.addAll(this.messageRepository.findByConversationIdOrderByCreatedAtDesc(conversation.getId(), PageRequest.of(0, number)));
                }
            } else {
                if(number == null || number <= 0) {
                    //
                } else {
                    messages.addAll(this.messageRepository.findByConversationIdAndCreatedAtLessThanEqualOrderByCreatedAtDesc(conversation.getId(), before, PageRequest.of(0, number)));
                }
            }

        }
        return conversationMapper.toConversationPage(conversation, messages);

    }

    @Transactional
    public Message sendMessageToConversation(UUID id, SendMessageRequestWithoutTo sendMessageRequest, UserFeignDto userFeignDto, String user) {

        if(!userFeignDto.uuid().equals(sendMessageRequest.getFrom())) {
            throw new UserNotAuthorizedException(String.format("User %s not authorized to send this message.", user));
        }

        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(String.format("Conversation %s not found.", id)));

        if(conversation.getParticipants().stream().filter(p -> p.getId().getUserId().equals(userFeignDto.uuid())).findAny().isEmpty()) {
            throw new UserNotAuthorizedException(String.format("User %s not authorized to view this conversation.", user));
        }

        UUID toParticipant = null;
        var cp = conversation.getParticipants().stream().filter(p -> !p.getId().getUserId().equals(userFeignDto.uuid())).findAny();
        if(cp.isPresent()) {
            toParticipant = cp.get().getId().getUserId();
        }

        Message message = Message.builder()
                .conversation(conversation)
                .senderId(userFeignDto.uuid())
                .content(sendMessageRequest.getContent())
                .createdAt(OffsetDateTime.now())
                .build();

        messageRepository.save(message);

        try {
            this.producer.send(
                    ChatMessage.builder()
                            .id(message.getId())
                            .from(userFeignDto.uuid())
                            .to(toParticipant != null ? toParticipant : userFeignDto.uuid())
                            .conversationId(conversation.getId())
                            .content(message.getContent())
                            .createdAt(message.getCreatedAt()).build());
        } catch(KafkaException ignored) {
        }

        return message;

    }
}

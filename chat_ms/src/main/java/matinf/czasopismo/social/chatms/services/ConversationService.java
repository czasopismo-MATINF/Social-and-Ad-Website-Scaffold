package matinf.czasopismo.social.chatms.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.chatms.data.ConversationRepository;
import matinf.czasopismo.social.chatms.data.Message;
import matinf.czasopismo.social.chatms.data.MessageRepository;
import matinf.czasopismo.social.chatms.data.UserFeignDto;
import matinf.czasopismo.social.chatms.exceptions.UserNotAuthorizedException;
import matinf.czasopismo.social.chatms.mappers.ConversationMapper;
import matinf.czasopismo.social.chatms.model.ConversationPage;
import matinf.czasopismo.social.chatms.model.SendMessageRequest;
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

    @Transactional
    public matinf.czasopismo.social.chatms.model.ConversationsListPage getConversations(List<UUID> participants, Integer number, OffsetDateTime before) {

        if(before != null) {
            var conversations = conversationRepository.findConversationsByParticipantsBefore(
                    participants,
                    participants.size(),
                    number,
                    before
            );
            return conversationMapper.toConversationsListPage(conversations);
        } else {
            var conversations = conversationRepository.findConversationsByParticipantsBefore(
                    participants,
                    participants.size(),
                    number
            );
            return conversationMapper.toConversationsListPage(conversations);
        }

    }

    @Transactional
    public matinf.czasopismo.social.chatms.model.ConversationPage getConversation(UUID id, boolean withMessages, UUID uuid, String user) {

        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found."));

        if(conversation.getParticipants().stream().filter(p -> p.getId().getUserId().equals(uuid)).findAny().isEmpty()) {
            throw new UserNotAuthorizedException(String.format("User %s not authorized to view this conversation.", user));
        }

        List<Message> messages = new LinkedList<>();

        if (withMessages) {
            messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(id);
        }

        return conversationMapper.toConversationPage(conversation, messages);

    }

    @Transactional
    public ConversationPage getConversation(UUID id, Boolean withMessages, UUID uuid, String user, OffsetDateTime before, Integer number) {

        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found."));

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

            //messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(id);
        }

        return conversationMapper.toConversationPage(conversation, messages);

    }

    @Transactional
    public void sendMessageToConversation(UUID id, SendMessageRequest sendMessageRequest, UserFeignDto userFeignDto, String user) {

        if(!userFeignDto.uuid().equals(sendMessageRequest.getFrom())) {
            throw new UserNotAuthorizedException(String.format("User %s not authorized to send this message.", user));
        }

        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found."));

        if(conversation.getParticipants().stream().filter(p -> p.getId().getUserId().equals(userFeignDto.uuid())).findAny().isEmpty()) {
            throw new UserNotAuthorizedException(String.format("User %s not authorized to view this conversation.", user));
        }

        Message message = Message.builder()
                .conversation(conversation)
                .senderId(userFeignDto.uuid())
                .content(sendMessageRequest.getContent())
                .createdAt(OffsetDateTime.now())
                .build();

        messageRepository.save(message);

    }
}

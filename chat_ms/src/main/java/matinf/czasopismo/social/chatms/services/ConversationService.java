package matinf.czasopismo.social.chatms.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.chatms.data.ConversationRepository;
import matinf.czasopismo.social.chatms.data.Message;
import matinf.czasopismo.social.chatms.data.MessageRepository;
import matinf.czasopismo.social.chatms.exceptions.UserNotAuthorizedException;
import matinf.czasopismo.social.chatms.mappers.ConversationMapper;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
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

        List<Message> messages = List.of();

        if (withMessages) {
            messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(id);
        }

        return conversationMapper.toConversationPage(conversation, messages);

    }

}

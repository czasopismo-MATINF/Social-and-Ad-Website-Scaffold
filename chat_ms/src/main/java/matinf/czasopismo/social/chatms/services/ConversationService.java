package matinf.czasopismo.social.chatms.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.chatms.data.ConversationRepository;
import matinf.czasopismo.social.chatms.data.Message;
import matinf.czasopismo.social.chatms.data.MessageRepository;
import matinf.czasopismo.social.chatms.mappers.ConversationMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ConversationMapper conversationMapper;

    @Transactional
    public matinf.czasopismo.social.chatms.model.ConversationsListPage getConversations(List<UUID> participants) {

        var conversations = conversationRepository.findConversationsByParticipants(
                participants,
                participants.size()
        );

        return conversationMapper.toConversationsListPage(conversations);
    }

    @Transactional
    public matinf.czasopismo.social.chatms.model.ConversationPage getConversation(UUID id, boolean withMessages) {

        var conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found."));

        List<Message> messages = List.of();

        if (withMessages) {
            messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(id);
        }

        return conversationMapper.toConversationPage(conversation, messages);

    }

}

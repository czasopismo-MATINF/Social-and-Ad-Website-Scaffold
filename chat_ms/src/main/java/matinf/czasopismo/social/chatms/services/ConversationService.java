package matinf.czasopismo.social.chatms.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.chatms.data.ConversationRepository;
import matinf.czasopismo.social.chatms.mappers.ConversationMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationMapper conversationMapper;

    @Transactional
    public matinf.czasopismo.social.chatms.model.ConversationsListPage getConversations(List<UUID> participants) {

        var conversations = conversationRepository.findConversationsByParticipants(
                participants,
                participants.size()
        );

        return conversationMapper.toConversationsListPage(conversations);
    }
}

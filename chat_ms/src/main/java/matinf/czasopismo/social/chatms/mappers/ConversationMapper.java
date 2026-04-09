package matinf.czasopismo.social.chatms.mappers;

import matinf.czasopismo.social.chatms.data.Conversation;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ConversationMapper {

    public matinf.czasopismo.social.chatms.model.ConversationsListPage toConversationsListPage(List<Conversation> conversations) {
        var page = new matinf.czasopismo.social.chatms.model.ConversationsListPage();
        page.setConversations(
                conversations.stream()
                        .map(this::toConversationPage)
                        .toList()
        );
        return page;
    }

    public matinf.czasopismo.social.chatms.model.ConversationPage toConversationPage(Conversation c) {
        var dto = new matinf.czasopismo.social.chatms.model.ConversationPage();
        dto.setId(c.getId());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        // messages nie są zwracane w tym endpointzie
        return dto;
    }
}

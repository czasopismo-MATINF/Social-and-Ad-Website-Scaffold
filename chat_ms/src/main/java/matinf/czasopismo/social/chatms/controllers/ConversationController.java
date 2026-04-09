package matinf.czasopismo.social.chatms.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.chatms.api.ConversationsApi;
import matinf.czasopismo.social.chatms.model.ConversationPage;
import matinf.czasopismo.social.chatms.model.ConversationsListPage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import matinf.czasopismo.social.chatms.services.ConversationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ConversationController implements matinf.czasopismo.social.chatms.api.ConversationsApi {

    private final ConversationService conversationService;

    @Override
    public ResponseEntity<ConversationsListPage> conversationsGet(List<UUID> participants) {
        return ResponseEntity.ok(
                conversationService.getConversations(participants)
        );
    }

    @Override
    public ResponseEntity<ConversationPage> conversationsIdGet(UUID id, Boolean withMessages) {
        return ConversationsApi.super.conversationsIdGet(id, withMessages);
    }

}

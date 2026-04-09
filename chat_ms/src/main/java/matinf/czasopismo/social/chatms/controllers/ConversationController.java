package matinf.czasopismo.social.chatms.controllers;

import matinf.czasopismo.social.chatms.api.ConversationsApi;
import matinf.czasopismo.social.chatms.model.ConversationPage;
import matinf.czasopismo.social.chatms.model.ConversationsListPage;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

public class ConversationController implements matinf.czasopismo.social.chatms.api.ConversationsApi {

    @Override
    public ResponseEntity<ConversationsListPage> conversationsGet(List<UUID> participants) {
        return ConversationsApi.super.conversationsGet(participants);
    }

    @Override
    public ResponseEntity<ConversationPage> conversationsIdGet(UUID id, Boolean withMessages) {
        return ConversationsApi.super.conversationsIdGet(id, withMessages);
    }

}

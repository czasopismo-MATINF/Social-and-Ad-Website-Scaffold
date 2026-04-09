package matinf.czasopismo.social.chatms.controllers;

import matinf.czasopismo.social.chatms.api.ConversationsApi;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

public class ConversationController implements matinf.czasopismo.social.chatms.api.ConversationsApi {

    @Override
    public ResponseEntity<Void> conversationsPost(List<UUID> participants) {
        return ConversationsApi.super.conversationsPost(participants);
    }

}

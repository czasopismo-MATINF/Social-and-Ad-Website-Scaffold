package matinf.czasopismo.social.chatms.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.chatms.model.SendMessageRequest;
import matinf.czasopismo.social.chatms.services.MessagesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MessagesController implements matinf.czasopismo.social.chatms.api.MessagesApi {

    private final MessagesService messagesService;

    @Override
    public ResponseEntity<Void> messagesPost(SendMessageRequest sendMessageRequest) {
        this.messagesService.sendNewMessage(sendMessageRequest.getFrom(), sendMessageRequest.getTo(), sendMessageRequest.getContent());
        return ResponseEntity.ok().build();
    }

}

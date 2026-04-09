package matinf.czasopismo.social.chatms.controllers;

import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.chatms.data.UserFeignDto;
import matinf.czasopismo.social.chatms.exceptions.UserNotAuthorizedException;
import matinf.czasopismo.social.chatms.feign.UserFeignClient;
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
    private final HttpServletRequest request;
    private final UserFeignClient userClient;

    @Override
    public ResponseEntity<ConversationsListPage> conversationsGet(List<UUID> participants) {
        String user = request.getHeader("X-Username");
        UserFeignDto userFeignDto;
        try {
            userFeignDto = this.userClient.getUser(user);
        } catch (FeignException ex) {
            throw new RuntimeException(ex.getMessage());
        }
        if(participants.stream().filter(u -> u.equals(userFeignDto.uuid())).findAny().isEmpty()) {
            throw new UserNotAuthorizedException(String.format("User %s not authorized to view this conversations.", user));
        }
        return ResponseEntity.ok(
                conversationService.getConversations(participants)
        );
    }

    @Override
    public ResponseEntity<ConversationPage> conversationsIdGet(UUID id, Boolean withMessages) {
        String user = request.getHeader("X-Username");
        UserFeignDto userFeignDto;
        try {
            userFeignDto = this.userClient.getUser(user);
        } catch (FeignException ex) {
            throw new RuntimeException(ex.getMessage());
        }
        return ResponseEntity.ok(this.conversationService.getConversation(id, withMessages, userFeignDto.uuid(), user));
    }

}
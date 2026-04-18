package matinf.czasopismo.social.chatms.controllers;

import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.chatms.data.Conversation;
import matinf.czasopismo.social.chatms.data.Message;
import matinf.czasopismo.social.chatms.data.UserFeignDto;
import matinf.czasopismo.social.chatms.exceptions.UserNotAuthorizedException;
import matinf.czasopismo.social.chatms.feign.UserFeignClient;
import matinf.czasopismo.social.chatms.mappers.ConversationMapper;
import matinf.czasopismo.social.chatms.mappers.MessageMapper;
import matinf.czasopismo.social.chatms.model.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import matinf.czasopismo.social.chatms.services.ConversationService;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ConversationController implements matinf.czasopismo.social.chatms.api.ConversationsApi {

    private final ConversationService conversationService;
    private final HttpServletRequest request;
    private final UserFeignClient userClient;
    private final ConversationMapper conversationMapper;

    @Override
    public ResponseEntity<ConversationsListPage> conversationsGet(List<UUID> participants, Integer number, OffsetDateTime before) {
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
        List<Conversation> conversations = conversationService.getConversations(participants, number, before);
        ConversationsListPage conversationListPage = conversationMapper.toConversationsListPage(conversations);
        return ResponseEntity.ok(conversationListPage);
    }

    @Override
    public ResponseEntity<ConversationPage> conversationsIdGet(UUID id, Boolean withMessages, OffsetDateTime before, Integer number) {
        String user = request.getHeader("X-Username");
        UserFeignDto userFeignDto;
        try {
            userFeignDto = this.userClient.getUser(user);
        } catch (FeignException ex) {
            throw new RuntimeException(ex.getMessage());
        }
        return ResponseEntity.ok(this.conversationService.getConversation(id, withMessages, userFeignDto.uuid(), user, before, number));
    }

    @Override
    public ResponseEntity<MessagePage> conversationsIdMessagesPost(UUID id, SendMessageRequestWithoutTo sendMessageRequestWithoutTo) {
        String user = request.getHeader("X-Username");
        UserFeignDto userFeignDto;
        try {
            userFeignDto = this.userClient.getUser(user);
        } catch (FeignException ex) {
            throw new RuntimeException(ex.getMessage());
        }
        Message message = this.conversationService.sendMessageToConversation(id, sendMessageRequestWithoutTo, userFeignDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageMapper.toMessagePage(message));
    }

}
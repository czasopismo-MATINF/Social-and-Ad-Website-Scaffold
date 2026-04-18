package matinf.czasopismo.social.chatms.controllers;

import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.chatms.data.Message;
import matinf.czasopismo.social.chatms.data.UserFeignDto;
import matinf.czasopismo.social.chatms.exceptions.UserNotAuthorizedException;
import matinf.czasopismo.social.chatms.feign.UserFeignClient;
import matinf.czasopismo.social.chatms.mappers.MessageMapper;
import matinf.czasopismo.social.chatms.model.MessagePage;
import matinf.czasopismo.social.chatms.model.SendMessageRequest;
import matinf.czasopismo.social.chatms.services.MessagesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MessagesController implements matinf.czasopismo.social.chatms.api.MessagesApi {

    private final MessagesService messagesService;
    private final HttpServletRequest request;
    private final UserFeignClient userClient;

    @Override
    public ResponseEntity<MessagePage> messagesPost(SendMessageRequest sendMessageRequest) {
        String user = request.getHeader("X-Username");
        UserFeignDto userFeignDto;
        try {
            userFeignDto = this.userClient.getUser(user);
        } catch (FeignException ex) {
            throw new RuntimeException(ex.getMessage());
        }
        if(!userFeignDto.uuid().equals(sendMessageRequest.getFrom())) {
            throw new UserNotAuthorizedException(String.format("User %s not authorized to send this message.", user));
        }
        Message message = this.messagesService.sendNewMessage(sendMessageRequest.getFrom(), sendMessageRequest.getTo(), sendMessageRequest.getContent());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(MessageMapper.toMessagePage(message));
    }

}

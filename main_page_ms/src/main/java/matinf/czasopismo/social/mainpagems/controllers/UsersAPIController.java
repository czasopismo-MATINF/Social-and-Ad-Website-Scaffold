package matinf.czasopismo.social.mainpagems.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.mainpagems.api.UsersApi;
import matinf.czasopismo.social.mainpagems.exceptions.UserNotAuthorizedException;
import matinf.czasopismo.social.mainpagems.mappers.UserMapper;
import matinf.czasopismo.social.mainpagems.model.UserPage;
import matinf.czasopismo.social.mainpagems.services.UserPageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UsersAPIController implements UsersApi {

    private final UserPageService userPageService;
    private final HttpServletRequest request;

    @Override
    public ResponseEntity<UserPage> usersUsernameGet(String username) {
        String user = request.getHeader("X-Username");
        if(user != null && user.equals(username)) {
            log.info("Użytkownik {} z filtrowaniem pól szuka samego siebie.", user);
            return ResponseEntity.ok(UserMapper.toDto((this.userPageService.getUserWithAttributesWithFieldsFilter(username))));
        } else {
            log.info("Zapytanie {} bez filtrowania pól szuka użytkownika {}.", user, username);
            return ResponseEntity.ok(UserMapper.toDto((this.userPageService.getUserWithAttributes(username))));
        }
    }

    @Override
    public ResponseEntity<UserPage> usersUsernamePut(String username, UserPage userPage) {
        String user = request.getHeader("X-Username");
        if(user == null || !user.equals(username)) {
            log.info("Użytkownik {} nie jest autoryzowany do zmieniania danych użytkownika {}.", user, username);
            throw new UserNotAuthorizedException(String.format("User %s not authorized to change data for user %s.", user, username));
        }
        return ResponseEntity.ok(UserMapper.toDto(this.userPageService.updateUser(username, userPage)));
    }
}

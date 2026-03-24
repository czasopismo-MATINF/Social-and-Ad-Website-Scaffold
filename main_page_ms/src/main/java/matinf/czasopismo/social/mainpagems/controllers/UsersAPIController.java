package matinf.czasopismo.social.mainpagems.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.mainpagems.api.UsersApi;
import matinf.czasopismo.social.mainpagems.mappers.UserMapper;
import matinf.czasopismo.social.mainpagems.model.UserPage;
import matinf.czasopismo.social.mainpagems.services.UserPageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UsersAPIController implements UsersApi {

    private final UserPageService userPageService;
    private final HttpServletRequest request;

    @Override
    public ResponseEntity<UserPage> usersUsernameGet(String username) {
        String userHeader = request.getHeader("X-Username");
        log.info(userHeader);
        return ResponseEntity.ok(UserMapper.toDto((this.userPageService.getUserWithAttributes(username))));
    }
}

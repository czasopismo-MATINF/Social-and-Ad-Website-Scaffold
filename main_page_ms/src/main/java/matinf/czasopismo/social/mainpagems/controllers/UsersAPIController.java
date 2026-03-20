package matinf.czasopismo.social.mainpagems.controllers;

import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.mainpagems.api.UsersApi;
import matinf.czasopismo.social.mainpagems.mappers.UserMapper;
import matinf.czasopismo.social.mainpagems.model.UserPage;
import matinf.czasopismo.social.mainpagems.services.UserPageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UsersAPIController implements UsersApi {

    private final UserPageService userPageService;

    @Override
    public ResponseEntity<UserPage> usersUsernameGet(String username) {
        return ResponseEntity.ok(UserMapper.toDto((this.userPageService.getUserWithAttributes(username))));
    }
}

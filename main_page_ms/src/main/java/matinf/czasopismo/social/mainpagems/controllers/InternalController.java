package matinf.czasopismo.social.mainpagems.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.mainpagems.api.InternalApi;
import matinf.czasopismo.social.mainpagems.data.User;
import matinf.czasopismo.social.mainpagems.mappers.InternalMapper;
import matinf.czasopismo.social.mainpagems.model.UserInfoPage;
import matinf.czasopismo.social.mainpagems.services.UserPageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class InternalController implements InternalApi {

    private final UserPageService userPageService;

    @Override
    public ResponseEntity<UserInfoPage> internalUsersUsernameGet(String username) {
        User user = this.userPageService.getUserWithAttributes(username);
        return ResponseEntity.ok(InternalMapper.toReturnType(user));
    }
}

package matinf.czasopismo.social.mainpagems.controllers;

import matinf.czasopismo.social.mainpagems.api.UsersApi;
import matinf.czasopismo.social.mainpagems.model.UserPageAttribute;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UsersAPIController implements UsersApi {
    @Override
    public ResponseEntity<List<UserPageAttribute>> usersUsernameGet(String username) {
        //TODO: implement
        return UsersApi.super.usersUsernameGet(username);
    }
}

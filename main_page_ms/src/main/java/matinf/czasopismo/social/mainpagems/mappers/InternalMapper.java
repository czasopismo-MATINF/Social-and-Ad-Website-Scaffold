package matinf.czasopismo.social.mainpagems.mappers;

import matinf.czasopismo.social.mainpagems.data.User;
import matinf.czasopismo.social.mainpagems.model.UserInfoPage;
import matinf.czasopismo.social.mainpagems.model.UserPage;
import matinf.czasopismo.social.mainpagems.model.UserPageAttribute;

import java.time.LocalDateTime;

public class InternalMapper {

    public static UserInfoPage toDto(User user) {

        UserInfoPage userInfoPage = new UserInfoPage();
        userInfoPage.setName(user.getUserName());
        userInfoPage.setUuid(user.getId());
        return userInfoPage;

    }
}

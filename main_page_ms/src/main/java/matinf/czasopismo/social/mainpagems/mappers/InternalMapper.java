package matinf.czasopismo.social.mainpagems.mappers;

import matinf.czasopismo.social.mainpagems.data.User;
import matinf.czasopismo.social.mainpagems.model.UserInfoPage;

public class InternalMapper {

    public static UserInfoPage toReturnType(User user) {

        UserInfoPage userInfoPage = new UserInfoPage();
        userInfoPage.setName(user.getUserName());
        userInfoPage.setUuid(user.getId());
        return userInfoPage;

    }
}

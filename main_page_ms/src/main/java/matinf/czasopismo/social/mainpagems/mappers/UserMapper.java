package matinf.czasopismo.social.mainpagems.mappers;

import matinf.czasopismo.social.mainpagems.data.User;
import matinf.czasopismo.social.mainpagems.model.UserPage;
import matinf.czasopismo.social.mainpagems.model.UserPageAttribute;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class UserMapper {

    public static UserPage toReturnType(User user) {
        UserPage userPage = new UserPage();
        userPage.id(user.getId());
        user.getAttributes().forEach(attr -> {
            userPage.addAttributesItem(new UserPageAttribute(attr.getAttributeName(), attr.getAttributeValue()));
        });
        return userPage;
    }

    public static User createEmptyModelUser(String username) {
        return User.builder()
                .userName(username)
                .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                .updatedAt(OffsetDateTime.now(ZoneOffset.UTC))
                .build();
    }

}

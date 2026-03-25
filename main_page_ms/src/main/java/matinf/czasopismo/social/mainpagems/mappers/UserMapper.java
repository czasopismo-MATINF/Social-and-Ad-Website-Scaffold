package matinf.czasopismo.social.mainpagems.mappers;

import matinf.czasopismo.social.mainpagems.data.User;
import matinf.czasopismo.social.mainpagems.model.UserPage;
import matinf.czasopismo.social.mainpagems.model.UserPageAttribute;

import java.time.LocalDateTime;

public class UserMapper {

    public static UserPage toDto(User user) {
        UserPage userPage = new UserPage();
        user.getAttributes().forEach(attr -> {
            userPage.addAttributesItem(new UserPageAttribute(attr.getAttributeName(), attr.getAttributeValue()));
        });
        return userPage;
    }

    public static User createEmptyModelUser(String username) {
        return User.builder()
                .userName(username)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

}

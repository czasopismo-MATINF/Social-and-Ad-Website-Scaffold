package matinf.czasopismo.social.mainpagems.mappers;

import matinf.czasopismo.social.mainpagems.data.User;
import matinf.czasopismo.social.mainpagems.data.UserPageAttribute;

import java.time.LocalDateTime;

public class AttributeMapper {

    public static void updateModelAttribute(UserPageAttribute modelAttribute, matinf.czasopismo.social.mainpagems.model.UserPageAttribute pageAttribute) {
        if(modelAttribute == null) return;
        if(pageAttribute == null) return;
        if(!pageAttribute.getAttributeName().equals(modelAttribute.getAttributeName())) return;
        modelAttribute.setAttributeValue(pageAttribute.getAttributeValue());
    }

    public static UserPageAttribute createModelAttribute(matinf.czasopismo.social.mainpagems.model.UserPageAttribute pageAttribute) {
        return UserPageAttribute.builder().attributeName(pageAttribute.getAttributeName()).createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .attributeValue(pageAttribute.getAttributeValue()).build();
    }

    public static UserPageAttribute createEmptyModelAttribute(String attributeName) {
        return UserPageAttribute.builder().createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).attributeName(attributeName).attributeValue("").build();
    }

}

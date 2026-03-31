package matinf.czasopismo.social.mainpagems.mappers;

import matinf.czasopismo.social.mainpagems.data.User;
import matinf.czasopismo.social.mainpagems.data.UserPageAttribute;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class AttributeMapper {

    public static void updateModelAttribute(UserPageAttribute modelAttribute, matinf.czasopismo.social.mainpagems.model.UserPageAttribute pageAttribute) {
        if(modelAttribute == null) return;
        if(pageAttribute == null) return;
        if(!pageAttribute.getAttributeName().equals(modelAttribute.getAttributeName())) return;
        modelAttribute.setAttributeValue(pageAttribute.getAttributeValue());
    }

    public static UserPageAttribute createModelAttribute(matinf.czasopismo.social.mainpagems.model.UserPageAttribute pageAttribute) {
        return UserPageAttribute.builder().attributeName(pageAttribute.getAttributeName())
                .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                .updatedAt(OffsetDateTime.now(ZoneOffset.UTC))
                .attributeValue(pageAttribute.getAttributeValue()).build();
    }

    public static UserPageAttribute createEmptyModelAttribute(String attributeName) {
        return UserPageAttribute.builder().createdAt(OffsetDateTime.now(ZoneOffset.UTC)).updatedAt(OffsetDateTime.now(ZoneOffset.UTC)).attributeName(attributeName).attributeValue("").build();
    }

}

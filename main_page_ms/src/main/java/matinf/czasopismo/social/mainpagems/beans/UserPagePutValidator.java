package matinf.czasopismo.social.mainpagems.beans;

import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.mainpagems.model.UserPage;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserPagePutValidator {

    private final PageFieldsConfigFilter pageFieldsConfigFilter;

    public boolean isValid(UserPage value) {
        if(value == null) return false;
        if(value.getAttributes() == null) return false;
        for(var field : this.pageFieldsConfigFilter.getPageFields()) {
            String requestValue = value.getAttributes().stream()
                    .filter(attr -> field.name().equals(attr.getAttributeName()))
                    .map(attr -> attr.getAttributeValue())
                    .findFirst()
                    .orElse(null);
            if(requestValue == null || requestValue.length() < field.min() || requestValue.length() > field.max()) {
                return false;
            }
        }
        return true;
    }

}

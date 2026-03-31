package matinf.czasopismo.social.adms.beans;

import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.adms.model.AdPageRequest;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdPageRequestValidator {

    public boolean isValid(AdPageRequest adPageRequest) {
        if(adPageRequest == null) return false;
        if(adPageRequest.getTitle() == null || adPageRequest.getContent() == null) return false;
        if(adPageRequest.getTitle().length() < 1 || adPageRequest.getContent().length() < 1) return false;
        return true;
    }

}

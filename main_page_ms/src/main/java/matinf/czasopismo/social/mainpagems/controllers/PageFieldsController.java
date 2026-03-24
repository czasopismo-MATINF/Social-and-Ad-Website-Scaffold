package matinf.czasopismo.social.mainpagems.controllers;

import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.mainpagems.api.PageFieldsConfigApi;
import matinf.czasopismo.social.mainpagems.beans.PageFieldsConfigFilter;
import matinf.czasopismo.social.mainpagems.model.PageField;
import matinf.czasopismo.social.mainpagems.model.PageFieldsConfig;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class PageFieldsController implements PageFieldsConfigApi {

    private final PageFieldsConfigFilter pageFields;

    @Override
    public ResponseEntity<PageFieldsConfig> pageFieldsConfigGet() {
        PageFieldsConfig pageFieldsConfig = new PageFieldsConfig();
        this.pageFields.getPageFields().forEach( pageFieldItem -> {
            pageFieldsConfig.addAttributesItem(new PageField(pageFieldItem.name(), pageFieldItem.min(), pageFieldItem.max()));
        });
        return ResponseEntity.ok(pageFieldsConfig);
    }
}

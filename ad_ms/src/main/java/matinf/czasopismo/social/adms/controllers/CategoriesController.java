package matinf.czasopismo.social.adms.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.adms.api.CategoriesApi;
import matinf.czasopismo.social.adms.mappers.CategoryMapper;
import matinf.czasopismo.social.adms.model.CategoriesPage;
import matinf.czasopismo.social.adms.services.AdService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CategoriesController implements CategoriesApi {

    private final AdService adService;

    @Override
    public ResponseEntity<CategoriesPage> categoriesGet() {
        CategoriesPage categoriesPage = new CategoriesPage();
        categoriesPage.setCategories(this.adService.getAllCategories().stream().map(CategoryMapper::toReturnType).collect(Collectors.toList()));
        return ResponseEntity.ok(categoriesPage);
    }

}

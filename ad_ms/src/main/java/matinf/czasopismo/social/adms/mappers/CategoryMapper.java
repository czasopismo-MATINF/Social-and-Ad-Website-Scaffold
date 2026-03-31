package matinf.czasopismo.social.adms.mappers;

import matinf.czasopismo.social.adms.data.Category;
import matinf.czasopismo.social.adms.model.CategoryPage;

public class CategoryMapper {

    public static CategoryPage toReturnType(Category category) {
        CategoryPage categoryPage = new CategoryPage();
        categoryPage.setId(category.getId());
        categoryPage.setDescription(category.getDescription());
        return categoryPage;
    }

}

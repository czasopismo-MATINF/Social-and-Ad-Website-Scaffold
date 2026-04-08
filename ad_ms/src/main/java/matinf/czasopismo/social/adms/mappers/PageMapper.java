package matinf.czasopismo.social.adms.mappers;

import matinf.czasopismo.social.adms.data.Ad;
import matinf.czasopismo.social.adms.model.AdPage;
import matinf.czasopismo.social.adms.model.Page;

import java.util.List;

public class PageMapper {

    public static Page toApiPage(List<AdPage> content, org.springframework.data.domain.Page<Ad> springPage) {
        Page apiPage = new Page();
        apiPage.setContent(content);
        apiPage.setTotalElements(springPage.getTotalElements());
        apiPage.setTotalPages(springPage.getTotalPages());
        apiPage.setSize(springPage.getSize());
        apiPage.setNumber(springPage.getNumber());
        apiPage.setFirst(springPage.isFirst());
        apiPage.setLast(springPage.isLast());
        apiPage.setNumberOfElements(springPage.getNumberOfElements());
        apiPage.setEmpty(springPage.isEmpty());
        return apiPage;
    }

}

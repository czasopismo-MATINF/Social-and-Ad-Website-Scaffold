package matinf.czasopismo.social.adms.mappers;

import matinf.czasopismo.social.adms.data.Ad;
import matinf.czasopismo.social.adms.model.AdPage;
import matinf.czasopismo.social.adms.model.AdPageRequest;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class AdMapper {

    public static AdPage toReturnType(Ad ad) {
        AdPage adPage = new AdPage();
        adPage.id(ad.getId()).category(ad.getCategoryId()).user(ad.getUserId()).title(ad.getTitle()).content(ad.getContent())
                .createdAt(ad.getCreatedAt()).updatedAt(ad.getUpdatedAt());
        return adPage;
    }

    public static Ad createEmptyAd(AdPageRequest adPageRequest) {

        return Ad.builder().title(adPageRequest.getTitle()).content(adPageRequest.getContent())
                .categoryId(adPageRequest.getCategory())
                .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                .updatedAt(OffsetDateTime.now(ZoneOffset.UTC))
                .build();

    }

}

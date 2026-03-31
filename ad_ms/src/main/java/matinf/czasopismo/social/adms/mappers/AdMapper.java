package matinf.czasopismo.social.adms.mappers;

import matinf.czasopismo.social.adms.data.Ad;
import matinf.czasopismo.social.adms.model.AdPage;
import matinf.czasopismo.social.adms.model.AdPageRequest;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

public class AdMapper {

    public static AdPage toDto(Ad ad) {
        AdPage adPage = new AdPage();
        adPage.id(ad.getId()).categoryId(ad.getCategoryId()).title(ad.getTitle()).content(ad.getContent());
        return adPage;
    }

    public static Ad createEmptyAd(AdPageRequest adPageRequest) {

        return Ad.builder().title(adPageRequest.getTitle()).content(adPageRequest.getContent())
                .categoryId(adPageRequest.getCategory())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

    }
}

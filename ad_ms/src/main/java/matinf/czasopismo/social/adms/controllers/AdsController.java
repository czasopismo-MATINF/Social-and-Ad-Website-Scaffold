package matinf.czasopismo.social.adms.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.adms.api.AdsApi;
import matinf.czasopismo.social.adms.beans.AdPageRequestValidator;
import matinf.czasopismo.social.adms.data.UserFeignDto;
import matinf.czasopismo.social.adms.exceptions.AdPagePostValidatorFailureException;
import matinf.czasopismo.social.adms.model.AdPage;
import matinf.czasopismo.social.adms.model.AdPageRequest;
import matinf.czasopismo.social.adms.model.AdPages;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import matinf.czasopismo.social.adms.mappers.AdMapper;
import matinf.czasopismo.social.adms.services.AdService;
import java.util.UUID;
import matinf.czasopismo.social.adms.feign.UserFeignClient;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AdsController implements AdsApi {

    private final HttpServletRequest request;
    private final AdPageRequestValidator adPageRequestValidator;
    private final AdService adService;
    private final UserFeignClient userClient;

    @Override
    public ResponseEntity<AdPages> adsGet(UUID userId) {
        return AdsApi.super.adsGet(userId);
    }

    @Override
    public ResponseEntity<Void> adsIdDelete(UUID id) {
        return AdsApi.super.adsIdDelete(id);
    }

    @Override
    public ResponseEntity<AdPage> adsIdGet(UUID id) {
        return AdsApi.super.adsIdGet(id);
    }

    @Override
    public ResponseEntity<AdPage> adsIdPut(UUID id) {
        return AdsApi.super.adsIdPut(id);
    }

    @Override
    public ResponseEntity<AdPage> adsPost(AdPageRequest adPageRequest) {
        String user = request.getHeader("X-Username");
        if(!this.adPageRequestValidator.isValid(adPageRequest)) {
            throw new AdPagePostValidatorFailureException(String.format("Ad title or content not long enough."));
        }
        UserFeignDto userFeignDto = this.userClient.getUser(user);
        log.info("User {} dodaje nowe ogłoszenie.", userFeignDto.uuid());
        //obsłużyc wyjątki feign
        return ResponseEntity.ok(AdMapper.toDto(this.adService.createAd(userFeignDto.uuid(), adPageRequest)));
    }
}

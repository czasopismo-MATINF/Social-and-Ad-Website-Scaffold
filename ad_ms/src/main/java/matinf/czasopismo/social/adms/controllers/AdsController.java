package matinf.czasopismo.social.adms.controllers;

import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.adms.api.AdsApi;
import matinf.czasopismo.social.adms.beans.AdPageRequestValidator;
import matinf.czasopismo.social.adms.data.Ad;
import matinf.czasopismo.social.adms.data.UserFeignDto;
import matinf.czasopismo.social.adms.exceptions.AdPagePostValidatorFailureException;
import matinf.czasopismo.social.adms.model.AdPage;
import matinf.czasopismo.social.adms.model.AdPageRequest;
import matinf.czasopismo.social.adms.model.AdPages;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import matinf.czasopismo.social.adms.mappers.AdMapper;
import matinf.czasopismo.social.adms.services.AdService;
import matinf.czasopismo.social.adms.exceptions.AdNotFoundException;

import java.util.Optional;
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
        String user = request.getHeader("X-Username");
        UserFeignDto userFeignDto;
        try {
            userFeignDto = this.userClient.getUser(user);
        } catch (FeignException ex) {
            throw new RuntimeException(ex.getMessage());
        }
        log.info("User {} chce usunąć ogłoszenie {}.", userFeignDto.uuid(), id);
        this.adService.deleteAd(id, userFeignDto.uuid());
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<AdPage> adsIdGet(UUID id) {
        Optional<Ad> ad = this.adService.getAdById(id);
        if(ad.isEmpty()) {
            throw new AdNotFoundException(String.format("Ad not found exception.", id));
        }
        return ResponseEntity.ok(AdMapper.toDto(ad.get()));
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
        UserFeignDto userFeignDto;
        try {
            userFeignDto = this.userClient.getUser(user);
        } catch (FeignException ex) {
            throw new RuntimeException(ex.getMessage());
        }
        log.info("User {} dodaje nowe ogłoszenie.", userFeignDto.uuid());
        return ResponseEntity.ok(AdMapper.toDto(this.adService.createAd(userFeignDto.uuid(), adPageRequest)));
    }
}

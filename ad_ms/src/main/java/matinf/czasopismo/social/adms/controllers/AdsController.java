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
import matinf.czasopismo.social.adms.model.Page;
import matinf.czasopismo.social.adms.querysearch.AdsFilter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import matinf.czasopismo.social.adms.mappers.AdMapper;
import matinf.czasopismo.social.adms.mappers.PageMapper;
import matinf.czasopismo.social.adms.services.AdService;
import matinf.czasopismo.social.adms.exceptions.AdNotFoundException;

import java.time.OffsetDateTime;
import java.util.List;
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

    private Sort parseSort(List<String> sortParams) {
        if (sortParams == null || sortParams.isEmpty()) {
            return Sort.unsorted();
        }
        List<Sort.Order> orders = sortParams.stream()
                .map(param -> {
                    String[] parts = param.split(",");
                    String property = parts[0];
                    Sort.Direction direction = parts.length > 1
                            ? Sort.Direction.fromString(parts[1])
                            : Sort.Direction.ASC;
                    return new Sort.Order(direction, property);
                })
                .toList();

        return Sort.by(orders);
    }

    @Override
    public ResponseEntity<Page> adsGet(Integer page, Integer size, List<String> sort, UUID user, OffsetDateTime from, OffsetDateTime to, List<UUID> users, List<UUID> categories, String keyword) {

        Pageable pageable = PageRequest.of(
                page != null ? page : 0,
                size != null ? size : 20,
                parseSort(sort)
        );

        AdsFilter filter = new AdsFilter(user, from, to, users, categories, keyword);

        org.springframework.data.domain.Page<Ad> springPage = adService.getFilterAds(pageable, filter);

        List<AdPage> mappedContent = springPage
                .getContent()
                .stream()
                .map(AdMapper::toReturnType)
                .toList();

        return ResponseEntity.ok(PageMapper.toApiPage(mappedContent, springPage));

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
        //log.info("User {} chce usunąć ogłoszenie {}.", userFeignDto.uuid(), id);
        this.adService.deleteAd(id, userFeignDto.uuid());
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<AdPage> adsIdGet(UUID id) {
        Optional<Ad> ad = this.adService.getAdById(id);
        if(ad.isEmpty()) {
            throw new AdNotFoundException(String.format("Ad not found exception."));
        }
        return ResponseEntity.ok(AdMapper.toReturnType(ad.get()));
    }

    @Override
    public ResponseEntity<AdPage> adsIdPut(UUID id, AdPageRequest adPageRequest) {
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
        //log.info("User {} updatuje ogłoszenie {}.", userFeignDto.uuid(), id);
        return ResponseEntity.ok(AdMapper.toReturnType(this.adService.updateAd(id, userFeignDto.uuid(), adPageRequest)));
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
        //log.info("User {} dodaje nowe ogłoszenie.", userFeignDto.uuid());
        return ResponseEntity.status(HttpStatus.CREATED).body(AdMapper.toReturnType(this.adService.createAd(userFeignDto.uuid(), adPageRequest)));
    }
}

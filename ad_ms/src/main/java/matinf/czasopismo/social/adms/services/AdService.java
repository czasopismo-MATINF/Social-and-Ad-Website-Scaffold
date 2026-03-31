package matinf.czasopismo.social.adms.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.adms.data.Ad;
import matinf.czasopismo.social.adms.data.AdRepository;
import matinf.czasopismo.social.adms.model.AdPageRequest;
import org.springframework.stereotype.Service;
import matinf.czasopismo.social.adms.mappers.AdMapper;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdService {

    private final AdRepository adRepository;

    @Transactional
    public Ad createAd(UUID userUUID, AdPageRequest adPageRequest) {
        Ad ad = AdMapper.createEmptyAd(adPageRequest);
        ad.setUserId(userUUID);
        return this.adRepository.save(ad);
    }

    @Transactional
    public Optional<Ad> getAdById(UUID id) {
       return this.adRepository.findById(id);
    }

}
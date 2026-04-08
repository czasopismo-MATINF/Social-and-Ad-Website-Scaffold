package matinf.czasopismo.social.adms.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface AdRepository extends JpaRepository<Ad, UUID>, JpaSpecificationExecutor<Ad> {

    Page<Ad> findByUserId(UUID userId, Pageable pageable);

}

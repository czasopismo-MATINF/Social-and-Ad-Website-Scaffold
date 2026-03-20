package matinf.czasopismo.social.mainpagems.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserPageAttributeRepository extends JpaRepository<UserPageAttribute, UUID> {

    List<UserPageAttribute> findByUser(User user);

}

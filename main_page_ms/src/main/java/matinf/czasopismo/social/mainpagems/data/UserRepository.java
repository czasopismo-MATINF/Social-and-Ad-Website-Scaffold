package matinf.czasopismo.social.mainpagems.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.attributes WHERE u.id = :id")
    Optional<User> findByIdWithAttributes(UUID id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.attributes WHERE u.userName = :userName")
    Optional<User> findByIdWithAttributes(String userName);

}

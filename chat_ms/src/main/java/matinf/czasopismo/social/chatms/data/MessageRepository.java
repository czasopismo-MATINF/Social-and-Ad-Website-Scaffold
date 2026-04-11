package matinf.czasopismo.social.chatms.data;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByConversationIdOrderByCreatedAtDesc(UUID conversationId);

    List<Message> findTopNByConversationIdOrderByCreatedAtDesc(
            UUID conversationId,
            Pageable pageable
    );

    List<Message> findByConversationIdAndCreatedAtBeforeOrderByCreatedAtDesc(
            UUID conversationId,
            OffsetDateTime before,
            Pageable pageable
    );

    List<Message> findByConversationIdAndCreatedAtLessThanEqualOrderByCreatedAtDesc(
            UUID conversationId,
            OffsetDateTime before,
            Pageable pageable
    );

}

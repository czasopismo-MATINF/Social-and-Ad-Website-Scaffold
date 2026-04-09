package matinf.czasopismo.social.chatms.data;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @Query(value = """
        SELECT c.*
        FROM conversations c
        WHERE c.id IN (
            SELECT cp.conversation_id
            FROM conversation_participants cp
            WHERE cp.user_id IN (:participants)
            GROUP BY cp.conversation_id
            HAVING COUNT(DISTINCT cp.user_id) = :participantsCount
        )
        ORDER BY c.updated_at DESC
        """,
            nativeQuery = true)
    List<Conversation> findConversationsByParticipants(
            @Param("participants") List<UUID> participants,
            @Param("participantsCount") int participantsCount
    );
}

package matinf.czasopismo.social.adms.data;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Ad {

    @Id
    @GeneratedValue
    @ToString.Include
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    @ToString.Include
    private String title;

    @Column(nullable = false)
    @ToString.Include
    private String content;

    @Column(name="category_id", nullable = false)
    @ToString.Include
    private UUID categoryId;

    @Column(name="user_id", nullable = false)
    @ToString.Include
    private UUID userId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

}

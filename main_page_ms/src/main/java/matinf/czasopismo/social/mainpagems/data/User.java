package matinf.czasopismo.social.mainpagems.data;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue
    @ToString.Include
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "user_name", nullable = false, unique = true)
    @ToString.Include
    private String userName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<UserPageAttribute> attributes = new ArrayList<>();

    public void addAttribute(UserPageAttribute attr) {
        attributes.add(attr);
        attr.setUser(this);
    }

    public boolean isAttributePresent(String attrName) {
        for(var attr : this.getAttributes()) {
            if(attr.getAttributeName().equals(attrName)) {
                return true;
            }
        }
        return false;
    }

    public UserPageAttribute getAttributeOrNull(String attrName) {
        for(var attr : this.getAttributes()) {
            if(attr.getAttributeName().equals(attrName)) {
                return attr;
            }
        }
        return null;
    }

}

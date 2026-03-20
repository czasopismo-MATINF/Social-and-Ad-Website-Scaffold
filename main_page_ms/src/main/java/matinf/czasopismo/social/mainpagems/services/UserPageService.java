package matinf.czasopismo.social.mainpagems.services;

import lombok.RequiredArgsConstructor;
import matinf.czasopismo.social.mainpagems.data.UserPageAttributeRepository;
import matinf.czasopismo.social.mainpagems.data.UserRepository;
import org.springframework.stereotype.Service;
import java.util.UUID;
import matinf.czasopismo.social.mainpagems.data.User;

@Service
@RequiredArgsConstructor
public class UserPageService {

    private final UserRepository userRepository;
    private final UserPageAttributeRepository attributeRepository;

    public User getUserWithAttributes(UUID id) {
        return userRepository.findByIdWithAttributes(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserWithAttributes(String userName) {
        return userRepository.findByIdWithAttributes(userName)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}

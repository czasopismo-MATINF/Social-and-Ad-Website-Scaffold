package matinf.czasopismo.social.mainpagems.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.mainpagems.beans.PageFieldsConfigFilter;
import matinf.czasopismo.social.mainpagems.data.UserPageAttribute;
import matinf.czasopismo.social.mainpagems.data.UserRepository;
import matinf.czasopismo.social.mainpagems.exceptions.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import matinf.czasopismo.social.mainpagems.data.User;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserPageService {

    private final UserRepository userRepository;
    private final PageFieldsConfigFilter pageFieldsConfigFilter;

    /*
    public User getUserWithAttributes(UUID id) {
        return userRepository.findByIdWithAttributes(id)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
    }
     */

    @Transactional
    public User getUserWithAttributes(String userName) {
        return userRepository.findByIdWithAttributes(userName)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
    }

    @Transactional
    public User getUserWithAttributesWithFieldsFilter(String userName) {

        User user = userRepository.findByIdWithAttributes(userName).orElse(null);

        try {

            if (user == null) {

                log.info("Tworzenie użytkownika {}.", userName);

                user = User.builder()
                        .userName(userName)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                this.userRepository.save(user);

                log.info("Użytkownik {} utworzony. Tworznie jego atrybutów.", userName);

                User finalUser = user;
                this.pageFieldsConfigFilter.getPageFields().forEach(field -> {
                    UserPageAttribute pageAttribute = UserPageAttribute.builder()
                            .attributeName(field.name())
                            .attributeValue("")
                            .createdAt(LocalDateTime.now())
                            .updatedAt((LocalDateTime.now()))
                            .user(finalUser)
                            .build();
                    finalUser.addAttribute(pageAttribute);
                });

                this.userRepository.save(user);

                log.info("Atrybuty użytkownika {} utworzono.", userName);

            } else {

                log.info("Naprawiam atrybuty użytkownika {}.", userName);

                User finalUser = user;
                this.pageFieldsConfigFilter.getPageFields().forEach( field -> {
                   if(!finalUser.isAttributePresent(field.name())) {
                       UserPageAttribute pageAttribute = UserPageAttribute.builder()
                               .attributeName(field.name())
                               .attributeValue("")
                               .createdAt(LocalDateTime.now())
                               .updatedAt((LocalDateTime.now()))
                               .user(finalUser)
                               .build();
                       finalUser.addAttribute(pageAttribute);
                   }
                });

                this.userRepository.save(user);

                log.info("Atrybuty użytkownika {} naprawiono.", userName);

            }

        } catch(Exception e) {
            log.error(e.toString());
        }

        return userRepository.findByIdWithAttributes(userName)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

    }

}

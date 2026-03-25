package matinf.czasopismo.social.mainpagems.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.mainpagems.beans.PageFieldsConfigFilter;
import matinf.czasopismo.social.mainpagems.data.UserRepository;
import matinf.czasopismo.social.mainpagems.exceptions.UserNotFoundException;
import matinf.czasopismo.social.mainpagems.mappers.AttributeMapper;
import matinf.czasopismo.social.mainpagems.mappers.UserMapper;
import matinf.czasopismo.social.mainpagems.model.UserPage;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import matinf.czasopismo.social.mainpagems.data.User;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserPageService {

    private final UserRepository userRepository;
    private final PageFieldsConfigFilter pageFieldsConfigFilter;

    @Transactional
    public User getUserWithAttributes(String username) {
        return userRepository.findByIdWithAttributes(username)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
    }

    @Transactional
    public User getUserWithAttributesWithFieldsFilter(String username) {

        User user = this.getOrCreateUser(username);
        this.fixUserAttributes(user);
        this.userRepository.save(user);
        return user;

        /*
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
        */
    }

    @Transactional
    public User updateUser(String username, UserPage userPage) {
        User user = this.getOrCreateUser(username);
        this.updateUserAttributes(user, userPage);
        this.userRepository.save(user);
        return user;
    }

    @Transactional
    private User getOrCreateUser(String username) {

        User user = userRepository.findByIdWithAttributes(username).orElse(null);
        if (user != null) return user;

        log.info("Tworzenie użytkownika {}.", username);

        user = UserMapper.createEmptyModelUser(username);
        this.userRepository.save(user);

        log.info("Użytkownik {} utworzony. Tworznie jego atrybutów.", username);

        User finalUser = user;
        this.pageFieldsConfigFilter.getPageFields().forEach(field -> {
            var pageAttribute = AttributeMapper.createEmptyModelAttribute(field.name());
            finalUser.addAttribute(pageAttribute);
        });
        this.userRepository.save(user);

        log.info("Atrybuty użytkownika {} utworzono.", username);

        return user;
    }

    /* modelAttribute ma być not null, userPageAttribute ma być poprawnym obiektem z name i value */
    /*
    private UserPageAttribute updateModelAttribute(UserPageAttribute modelAttribute, matinf.czasopismo.social.mainpagems.model.UserPageAttribute userPageAttribute) {
        if(userPageAttribute == null) return modelAttribute;
        if(modelAttribute == null) {
            return UserPageAttribute.builder().attributeName(userPageAttribute.getAttributeName())
                    .attributeValue(userPageAttribute.getAttributeValue()).build();
        }
        if(!modelAttribute.getAttributeName().equals(userPageAttribute.getAttributeName())) {
            return modelAttribute;
        }
        modelAttribute.setAttributeValue(userPageAttribute.getAttributeValue());
        return modelAttribute;

    }
    */

    /* user ma być not null */
    private void fixUserAttributes(User user) {
        this.pageFieldsConfigFilter.getPageFields().forEach( field -> {
            var modelAttribute = user.getAttributeOrNull(field.name());
            if(modelAttribute == null) {
                user.addAttribute(AttributeMapper.createEmptyModelAttribute(field.name()));
            }
        });
    }

    /* user ma być not null, userPage ma być not null */
    private void updateUserAttributes(User user, UserPage userPage) {

        this.pageFieldsConfigFilter.getPageFields().forEach( field -> {
            var modelAttribute = user.getAttributeOrNull(field.name());
            var pageAttribute = userPage.getAttributes().stream().filter( a -> field.name().equals(a.getAttributeName()))
                    .findFirst().orElse(null);
            if(modelAttribute == null) {
                if (pageAttribute != null) {
                    user.addAttribute(AttributeMapper.createModelAttribute(pageAttribute));
                }
            } else {
                if(pageAttribute != null) {
                    AttributeMapper.updateModelAttribute(modelAttribute, pageAttribute);
                }
            }
        });

    }

}

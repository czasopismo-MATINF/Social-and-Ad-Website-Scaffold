package matinf.czasopismo.social.adms.feign;

import matinf.czasopismo.social.adms.data.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "user-service",
        url = "${user.service.url}" // opcjonalne, jeśli nie używasz service discovery
)
public interface UserClient {

    @GetMapping("/internal/users/{userName}")
    UserDto getUser(@PathVariable String userName);
}

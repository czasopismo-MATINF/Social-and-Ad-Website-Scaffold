package matinf.czasopismo.social.websocketms;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(
        name = "user-service",
        url = "${user.service.url}" // opcjonalne, jeśli nie używasz service discovery
)
public interface UserFeignClient {

    @GetMapping("/internal/users/{userName}")
    UserFeignDto getUser(@PathVariable String userName);

}

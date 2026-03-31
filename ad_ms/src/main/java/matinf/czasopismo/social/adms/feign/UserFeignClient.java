package matinf.czasopismo.social.adms.feign;

import matinf.czasopismo.social.adms.data.UserFeignDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "user-service",
        url = "${user.service.url}" // opcjonalne, jeśli nie używasz service discovery
)
public interface UserFeignClient {

    @GetMapping("/internal/users/{userName}")
    UserFeignDto getUser(@PathVariable String userName);

}

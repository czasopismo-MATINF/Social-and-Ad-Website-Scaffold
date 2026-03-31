package matinf.czasopismo.social.adms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class AdmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(AdmsApplication.class, args);
	}

}

package matinf.czasopismo.social.websocketms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class WebsocketmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebsocketmsApplication.class, args);
	}

}

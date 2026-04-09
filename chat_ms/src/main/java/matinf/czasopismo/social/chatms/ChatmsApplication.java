package matinf.czasopismo.social.chatms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ChatmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatmsApplication.class, args);
	}

}

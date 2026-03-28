package matinf.czasopismo.social.mainpagems.beans;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Getter
public class PageFieldsConfigFilter {

    public record PageFieldConfigRecord(String name, int min, int max) {}

    private List<PageFieldConfigRecord> pageFields = List.of(
           new PageFieldConfigRecord("username", 4, 256),
           new PageFieldConfigRecord("mobile phone", 0, 256),
           new PageFieldConfigRecord("fb url", 0, 512),
           new PageFieldConfigRecord("li url", 0, 512),
           new PageFieldConfigRecord("description", 0, 2048),
           new PageFieldConfigRecord("primary language code", 0, 2)
    );

}

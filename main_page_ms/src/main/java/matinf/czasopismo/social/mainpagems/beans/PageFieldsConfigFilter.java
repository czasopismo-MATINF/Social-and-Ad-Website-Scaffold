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
           new PageFieldConfigRecord("phone", 1, 256),
           new PageFieldConfigRecord("fburl", 1, 512),
           new PageFieldConfigRecord("liurl", 1, 512),
           new PageFieldConfigRecord("description", 1, 2048)
    );

}

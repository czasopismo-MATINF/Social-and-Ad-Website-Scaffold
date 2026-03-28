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
            new PageFieldConfigRecord("name", 0, 100),
            new PageFieldConfigRecord("last name", 0, 100),
            new PageFieldConfigRecord("phone", 0, 50),
            new PageFieldConfigRecord("fb page", 0, 256),
            new PageFieldConfigRecord("li page", 0, 256),
            new PageFieldConfigRecord("yt page", 0, 256),
            new PageFieldConfigRecord("description", 0, 5096),
            new PageFieldConfigRecord("location", 0, 2048),
            new PageFieldConfigRecord("accessibility", 0, 256)
    );

}

package matinf.czasopismo.social.mainpagems.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import matinf.czasopismo.social.mainpagems.api.TestResponseApi;

@RestController
public class TestRepsonseController implements TestResponseApi {

    @Override
    public ResponseEntity<Void> testResponseGet() {
        return ResponseEntity.ok(null);
    }

}

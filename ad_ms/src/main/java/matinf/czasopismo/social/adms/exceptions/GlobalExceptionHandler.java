package matinf.czasopismo.social.adms.exceptions;

import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.adms.model.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.time.ZoneOffset;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(AdPagePostValidatorFailureException.class)
    public ResponseEntity<ErrorResponse> handleTitleOrContentNotLongEnough(AdPagePostValidatorFailureException ex) {
        log.info("Jestem w metodzie: {}", new Object() {}.getClass().getEnclosingMethod().getName());
        log.error(ex.toString());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Ad title or content not long enough",
                Instant.now().atOffset(ZoneOffset.UTC)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

}

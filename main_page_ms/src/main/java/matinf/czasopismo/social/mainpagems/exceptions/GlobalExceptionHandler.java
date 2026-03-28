package matinf.czasopismo.social.mainpagems.exceptions;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import matinf.czasopismo.social.mainpagems.model.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.HttpMediaTypeNotSupportedException;

import java.time.Instant;
import java.time.ZoneOffset;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        log.info("Jestem w metodzie handleUserNotFound.", new Object() {}.getClass().getEnclosingMethod().getName());
        log.error(ex.toString());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "User not found",
                Instant.now().atOffset(ZoneOffset.UTC)
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.info("Jestem w metodzie: {}", new Object() {}.getClass().getEnclosingMethod().getName());
        log.error(ex.toString());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Unexpected error",
                Instant.now().atOffset(ZoneOffset.UTC)
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidParams(ConstraintViolationException ex) {
        log.info("Jestem w metodzie: {}", new Object() {}.getClass().getEnclosingMethod().getName());
        log.error(ex.toString());
        String message = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .findFirst()
                .orElse("Invalid request");

        return ResponseEntity.badRequest().body(
                new ErrorResponse(
                        400,
                        message,
                        Instant.now().atOffset(ZoneOffset.UTC)
                )
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleBodyError(HttpMessageNotReadableException ex) {
        log.info("Jestem w metodzie: {}", new Object() {}.getClass().getEnclosingMethod().getName());
        log.error(ex.toString());
        return ResponseEntity.badRequest().body(
                new ErrorResponse(400, "Invalid request body", Instant.now().atOffset(ZoneOffset.UTC)));
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleBodyError(HttpMediaTypeNotSupportedException ex) {
        log.info("Jestem w metodzie: {}", new Object() {}.getClass().getEnclosingMethod().getName());
        log.error(ex.toString());
        return ResponseEntity.badRequest().body(
                new ErrorResponse(400, "Media type not supported", Instant.now().atOffset(ZoneOffset.UTC)));
    }

    @ExceptionHandler(UserPagePutValidatorFailureException.class)
    public ResponseEntity<ErrorResponse> handlePutValidation(UserPagePutValidatorFailureException ex) {
        log.info("Jestem w metodzie: {}", new Object() {}.getClass().getEnclosingMethod().getName());
        log.error(ex.toString());
        return ResponseEntity.badRequest().body(
                new ErrorResponse(400, ex.getMessage(), Instant.now().atOffset(ZoneOffset.UTC))
        );
    }
}

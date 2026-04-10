package matinf.czasopismo.social.gateway_ms;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;

@Service
@Slf4j
public class JwtService {

    private final String issuer = "http://localhost:8081/realms/test_realm";
    private final String jwksUrl = "http://social-keycloak:8080/realms/test_realm/protocol/openid-connect/certs";

    private volatile JWKSet jwkSet;

    private final boolean LOG = false;

    public JwtService() {
        refreshKeys();
    }

    public boolean validateToken(String token) {

        if(LOG) log.info("Sprawdzam token: {}.", token);

        try {
            SignedJWT jwt = SignedJWT.parse(token);

            if(LOG) log.info("1 {}.", jwt.toString());

            // 1. Pobierz klucz publiczny z JWKS
            JWK jwk = getKey(jwt.getHeader().getKeyID());
            if (jwk == null) {
                refreshKeys();
                jwk = getKey(jwt.getHeader().getKeyID());
                if (jwk == null) return false;
            }

            if(LOG) log.info("2 {}.", jwk.toString());

            // 2. Weryfikacja podpisu
            JWSVerifier verifier = new RSASSAVerifier((RSAKey) jwk);
            if (!jwt.verify(verifier)) return false;

            if(LOG) log.info("3 {}.", verifier.toString());
            if(LOG) log.info("Issuer {}.", jwt.getJWTClaimsSet().getIssuer());

            // 3. Weryfikacja issuer
            if (!issuer.equals(jwt.getJWTClaimsSet().getIssuer())) return false;

            if(LOG) log.info("4.");
            if(LOG) log.info(jwt.getJWTClaimsSet().getIssuer());
            if(LOG) log.info(issuer);

            // 4. Weryfikacja dat
            Date now = new Date();

            if(LOG) log.info("4.5 {}.", jwt.getJWTClaimsSet().getExpirationTime().toString());
            if(LOG) if(jwt.getJWTClaimsSet().getNotBeforeTime() != null) log.info("4.6 {}.", jwt.getJWTClaimsSet().getNotBeforeTime().toString());
            if(LOG) log.info("4.7 {}.", now.toString());

            if (jwt.getJWTClaimsSet().getExpirationTime().before(now)) return false;
            if (jwt.getJWTClaimsSet().getNotBeforeTime() != null &&
                    jwt.getJWTClaimsSet().getNotBeforeTime().after(now)) return false;

            if(LOG) log.info("5 {} zwracam true.", now.toString());

            return true;

        } catch (Exception e) {

            if(LOG) log.info("6 - zwracam false.");
            return false;

        }
    }

    private JWK getKey(String kid) {
        if (jwkSet == null) return null;
        return jwkSet.getKeyByKeyId(kid);
    }

    private void refreshKeys() {
        try {
            this.jwkSet = JWKSet.load(new URL(jwksUrl));
        } catch (Exception e) {
            this.jwkSet = null;
        }
    }

}

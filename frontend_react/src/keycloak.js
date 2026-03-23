import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8081",
  realm: "test_realm",
  clientId: "test_client"
});

export default keycloak;

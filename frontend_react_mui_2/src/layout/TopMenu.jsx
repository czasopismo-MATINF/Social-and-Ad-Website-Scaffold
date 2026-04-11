import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import keycloak from "../keycloak.js";

import { useSelector, useDispatch } from 'react-redux'

const TopMenu = () => {

  const keycloakLoggedIn = useSelector(state => state.main.keycloakLoggedIn);
  const userInfo = useSelector(state => state.main.userInfo);

  function getDisplayName(userInfo) {
    if(!userInfo) return ``;
    let name = userInfo.user.attributes.filter(a => a.attributeName === "name")[0].attributeValue;
    let lastName = userInfo.user.attributes.filter(a => a.attributeName === "last name")[0].attributeValue;
    return `${name} ${lastName}`
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ gap: 2, fontFamily: "Courier New, monospace" }}>
        
        {/* Lewa część menu */}
        <Button color="inherit" component={RouterLink} to="/">
          Strona główna
        </Button>

        <Button color="inherit" component={RouterLink} to="/two-columns">
          Dwie kolumny
        </Button>

        {keycloakLoggedIn && <Button color="inherit" component={RouterLink} to="/userads">
          Ogłoszenia Użytkownika
        </Button>}

        {/* Dodawaj kolejne wpisy tutaj */}
        {/* <Button color="inherit" component={RouterLink} to="/inna">Inna</Button> */}

        {/* Elastyczna przestrzeń wypychająca prawą część */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Prawa część menu */}
        {/* Jeśli NIE zalogowany → pokaż Zaloguj */}
        {!keycloakLoggedIn && (
          <Button color="inherit" onClick={() => keycloak.login()}>
            Zaloguj / Utwórz konto
          </Button>
        )}

        {/* Jeśli zalogowany → pokaż userInfo */}
        {keycloakLoggedIn && (
          <Button color="inherit" component={RouterLink} to="/userinfo">
            {getDisplayName(userInfo)}
          </Button>
        )}

        {/* Jeśli zalogowany → pokaż Wyloguj */}
        {keycloakLoggedIn && (
          <Button color="inherit" onClick={() => keycloak.logout()}>
            Wyloguj
          </Button>
        )}

      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;

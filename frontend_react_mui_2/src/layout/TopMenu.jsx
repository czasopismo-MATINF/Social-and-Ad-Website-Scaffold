import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import keycloak from "../keycloak.js";

import usersInfoUtil from "../usersInfoUtil.js"

import { useSelector, useDispatch } from 'react-redux'

const TopMenu = () => {

  const keycloakLoggedIn = useSelector(state => state.main.keycloakLoggedIn);
  const userInfo = useSelector(state => state.main.userInfo);

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ gap: 2, fontFamily: "Courier New, monospace" }}>
        
        {/* Lewa część menu */}
        <Button color="inherit" component={RouterLink} to="/">
          Strona główna
        </Button>

        <Button color="inherit" component={RouterLink} to="/ads">
          Ogłoszenia
        </Button>

        {keycloakLoggedIn && <Button color="inherit" component={RouterLink} to="/chat">
          Czat
        </Button>}

        {keycloakLoggedIn && <Button color="inherit" component={RouterLink} to="/userads">
          Ogłoszenia Użytkownika
        </Button>}

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
            {usersInfoUtil.getDisplayName(userInfo)}
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

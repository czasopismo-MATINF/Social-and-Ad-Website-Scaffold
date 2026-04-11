import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const TopMenu = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ gap: 2 }}>
        <Button color="inherit" component={RouterLink} to="/">
          Strona główna
        </Button>
        <Button color="inherit" component={RouterLink} to="/two-columns">
          Dwie kolumny
        </Button>

        {/* Dodawaj kolejne wpisy tutaj */}
        {/* <Button color="inherit" component={RouterLink} to="/inna">Inna</Button> */}
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;

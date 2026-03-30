import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown.jsx';
import Sitemark from './SitemarkIcon.jsx';

import keycloak from "../keycloak.js";

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import { Link } from 'react-router-dom'

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Sitemark />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

              <Button component={Link} to="/" variant="text" color="info" size="small">Główna</Button>
              <Button component={Link} to="/info" variant="text" color="info" size="small">Info</Button>
              <Button component={Link} to="/inforaw" variant="text" color="info" size="small">Info Surowe</Button>
              <Button component={Link} to="/edit" variant="text" color="info" size="small">Edytuj</Button>
              <Button component={Link} to="/editraw" variant="text" color="info" size="small">Edytuj Surowe</Button>
              <Button component={Link} to="/about" variant="text" color="info" size="small">
                About
              </Button>
              <Button component={Link} to="/faq" variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                FAQ
              </Button>

            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
              {
                (() => {
                  if (!keycloak.authenticated) {
                    return <>
                    <Button color="primary" variant="outlined" size="small" onClick={() => keycloak.login()}>Zaloguj</Button>
                    <Button color="primary" variant="outlined" size="small" onClick={() => keycloak.login()}>Załóż konto</Button>
                    </>
                  } else {
                    return <>
                    <Chip
                      avatar={<Avatar>{keycloak.tokenParsed?.preferred_username[0]}</Avatar>}
                      label={`Zalogowany: ${keycloak.tokenParsed?.preferred_username}`}
                    />
                    <Button color="primary" variant="outlined" size="small" onClick={() => keycloak.logout()}>Wyloguj</Button>
                    </>
                  }
                  return null;
                })()
            }
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              slotProps={{
                paper: {
                  sx: {
                    top: 'var(--template-frame-height, 0px)',
                  },
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem>
                  <Button component={Link} to="/" color="primary" variant="contained" fullWidth>Główna</Button>
                </MenuItem>
                <MenuItem>
                  <Button component={Link} to="/info" color="primary" variant="contained" fullWidth>Info</Button>
                </MenuItem>
                    <MenuItem>
                  <Button component={Link} to="/inforaw" color="primary" variant="contained" fullWidth>Info Surowe</Button>
                </MenuItem>
                <MenuItem>
                  <Button component={Link} to="/edit" color="primary" variant="contained" fullWidth>Edytuj</Button>
                </MenuItem>
                <MenuItem>
                  <Button component={Link} to="/editraw" color="primary" variant="contained" fullWidth>Edytuj Surowe</Button>
                </MenuItem>
                <MenuItem>
                  <Button component={Link} to="/about" color="primary" variant="contained" fullWidth>About</Button>
                </MenuItem>
                <MenuItem>
                  <Button component={Link} to="/faq" color="primary" variant="contained" fullWidth>FAQ</Button>
                </MenuItem>
                <Divider sx={{ my: 3 }} />
                {
                (() => {
                  if (!keycloak.authenticated) {
                   return <>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth onClick={() => keycloak.login()}>Zaloguj</Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth onClick={() => keycloak.login()}>Załóż konto</Button>
                </MenuItem>
                </> } else {
                  return <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth onClick={() => keycloak.logout()}>Wyloguj</Button>
                </MenuItem>
                } return null; })()}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}

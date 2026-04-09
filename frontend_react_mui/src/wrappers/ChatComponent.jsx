import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../../shared-theme/AppTheme.jsx';
import AppAppBar from '../components/AppAppBar.jsx';
import Chat from '../components/Chat.jsx';
import EditAd from '../components/EditAd.jsx';
import PageContent from '../components/PageContent.jsx';

export default function ChatComponent(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Chat />
    </AppTheme>
  );
}

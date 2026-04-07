import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../../shared-theme/AppTheme.jsx';
import AppAppBar from '../components/AppAppBar.jsx';
import Footer from '../components/Footer.jsx';
import EditAd from '../components/EditAd.jsx';
import PageContent from '../components/PageContent.jsx';

export default function EditAdsComponent(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4, pt: 10 }}
      >
        <PageContent><EditAd /></PageContent>
      </Container>
      <Footer />
    </AppTheme>
  );
}

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../../shared-theme/AppTheme.jsx';
import AppAppBar from '../components/AppAppBar.jsx';
import MainContent from '../components/MainContent.jsx';
import Latest from '../components/Latest.jsx';
import Footer from '../components/Footer.jsx';
import EditAds from '../components/EditAds.jsx';
import PageContent from '../components/PageContent.jsx';

import * as React from 'react';

import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import NewAdFormComponent from '../components/NewAdFormComponent.jsx'

import keycloak from "../keycloak.js";

function getUserAds(keycloak, userInfo, pageNumber, pageSize, setAds) {
    console.log("GETTING USER ADS");
    if(!keycloak.authenticated) {
      console.log("User not authenticated, skipping user info fetch");
      return;
    }
    fetch(`http://localhost:3020/ads?user=${userInfo.id}&page=${pageNumber}&size=${pageSize}&sort=updatedAt,desc&sort=title,asc`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + keycloak.token,
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(data => {
      console.log("USER ADS FETCHED", data);
      setAds(data);
    });
}

export default function EditAdsComponent({children, ...props}) {

  const userInfo = useSelector(state => state.example.userInfo);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("size") ?? 4);

  const [page, setPage] = React.useState(initialPage - 1);
  const [ads, setAds] = React.useState(null);
  
  React.useEffect(() => {
    if (userInfo?.id) {
        getUserAds(keycloak, userInfo, page, pageSize, setAds);
    }
  }, [userInfo, page]);

  const handlePageChange = (_, value) => {
    setPage(value - 1);
    setSearchParams({ page: value, size: pageSize });
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4, pt: 10 }}
      >
        <PageContent><NewAdFormComponent reloadAds={() => {getUserAds(keycloak, userInfo, page, pageSize, setAds);}} /></PageContent>
        <EditAds reloadAds={() => {getUserAds(keycloak, userInfo, page, pageSize, setAds);}}
         ads={ads} page={page} pageSize={pageSize} handlePageChange={handlePageChange}/>
      </Container>
      <Footer />
    </AppTheme>
  );
}

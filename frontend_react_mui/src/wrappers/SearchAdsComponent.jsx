import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../../shared-theme/AppTheme.jsx';
import AppAppBar from '../components/AppAppBar.jsx';
import Footer from '../components/Footer.jsx';
import SearchAdsList from '../components/SearchAdsList.jsx';
import PageContent from '../components/PageContent.jsx';
import SearchAdForm from '../components/SearchAdForm.jsx';

import * as React from 'react';

import { useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { categoriesLoaded } from '../../store/slice.js'

import keycloak from "../keycloak.js";

function getAds(queryString, setAds) {
    console.log("GETTING ADS");
    fetch(`http://localhost:3020/ads?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(data => {
      console.log("ADS FETCHED", data);
      setAds(data);
    });
}

function getCategoriesInfo(dispatch) {
    console.log("GETTING CATEGORIES INFO");
    fetch(`http://localhost:3020/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(data => {
      console.log("CATEGORIES INFO FETCHED", data);
      dispatch(categoriesLoaded(data));
    });
}

export default function EditAdsComponent({children, ...props}) {
  
  const categoriesInfo = useSelector(state => state.example.categories);

  const location = useLocation();
//  const queryString = location.search; // np. "?page=1&size=20&keyword=test"
  const [searchParams, setSearchParams] = useSearchParams();
//  const urlPage = Number(searchParams.get("page") ?? 1);
//  const pageSize = Number(searchParams.get("size") ?? 4);
//  const backendPage = Number(searchParams.get("page") ?? 1) - 1;

  const [ads, setAds] = React.useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handlePageChange = (_, value) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set("page", value);
      return params;
    });
  };

  const handleSearchForm = (filters) => {
    console.log(filters);
    setSearchParams(prev => {
      //TODO: tu powinno być pobranie aktualnych searchParams z aktualnym stronicowaniem i nadpisanie filtrów
      const params = new URLSearchParams(filters);
      console.log(params);
      return params;
    });
  };

  React.useEffect(() => {
    getCategoriesInfo(dispatch);
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const backendParams = new URLSearchParams(params);
    backendParams.set("page", Number(params.get("page") ?? 1) - 1);
    getAds(backendParams.toString(), setAds);
  }, [location.search]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4, pt: 10 }}
      >
        <PageContent>
          <SearchAdForm handleSearchForm={handleSearchForm} searchParams={searchParams} />
        </PageContent>
        <SearchAdsList ads={ads} handlePageChange={handlePageChange}/>
      </Container>
      <Footer />
    </AppTheme>
  );
}

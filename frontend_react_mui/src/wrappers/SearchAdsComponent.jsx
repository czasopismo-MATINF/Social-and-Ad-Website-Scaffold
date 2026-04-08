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
    //przygotowanie niektórych parametrów filtrów, które wszystkie są jako dane String w formacie do tablic
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== "")
    );
    cleanFilters.users = cleanFilters.users ? cleanFilters.users.split(",") : [];
    cleanFilters.categories = cleanFilters.categories ? cleanFilters.categories.split(",") : [];
    
    console.log(cleanFilters);

    setSearchParams(prev => {    // pobieramy poprzednie wartości
      const prevPage = prev.get("page");
      const prevSize = prev.get("size");

      // tworzymy NOWY obiekt searchParams
      const params = new URLSearchParams();

      // ustawiamy page
      if (prevPage !== null) {
        params.set("page", prevPage);
      } else {
        params.set("page", 1); // domyślna strona
      }

      // ustawiamy size
      if (prevSize !== null) {
        params.set("size", prevSize);
      } else {
        params.set("size", 4); // domyślny rozmiar strony
      }

      Object.entries(cleanFilters).forEach(([key, value]) => {

        // 1. Jeśli wartość jest tablicą → usuń stare i dodaj nowe
        if (Array.isArray(value)) {
          params.delete(key);
          value.forEach(v => params.append(key, v));
          return;
        }

        // 2. Jeśli wartość jest pusta → usuń parametr
        if (value === undefined || value === null || value === "") {
          params.delete(key);
          return;
        }

        // 3. Normalne wartości
        params.set(key, value);
      });

      console.log(params.toString());

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

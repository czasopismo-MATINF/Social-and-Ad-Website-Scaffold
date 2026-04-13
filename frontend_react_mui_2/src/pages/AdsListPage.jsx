import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Box,
  Typography,
  TextField
} from "@mui/material";

import keycloak from "../keycloak.js";
import usersInfoUtil from "../usersinfo.js"

import { useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import * as Reducers from '../store/slice.js'

import ContactAdInlineForm from '../components/ContactAdInlineForm.jsx'

function getAds(queryString, callback) {
    console.log("GETTING ADS");
    console.log(`http://localhost:3020/ads?${queryString}`);
    fetch(`http://localhost:3020/ads?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(data => {
      console.log("ADS FETCHED", data);
      if(callback) callback(data);
    });
}

function getCategoriesInfo(keycloak, dispatch) {
    console.log("GETTING CATEGORIES INFO");
    fetch(`http://localhost:3020/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(data => {
      console.log("CATEGORIES INFO FETCHED", data);
      dispatch(Reducers.categoriesInfoCollected(data));
    });
}

function getUsersInfo(keycloak, ads, dispatch) {
  console.log("GETTING USERS INFO", ads);
  if(!ads || !ads.content) return;
  const uitf = new Map();
  for(const ad of ads.content) {
    uitf.set(ad.user, ad);
  }
  for(const u of uitf.keys()) {
    usersInfoUtil.getUserInfo(keycloak, u, (data) => {
      dispatch(Reducers.anotherUserInfoCollected(data));
    });
  }
}

const AdsListPage = () => {
  
  const userInfo = useSelector(state => state.main.userInfo);
  const categoriesInfo = useSelector(state => state.main.categoriesInfo);
  const keycloakLoggedIn = useSelector(state => state.main.keycloakLoggedIn);
  const usersInfo = useSelector(state => state.main.usersInfo);

  function getCategoryName(categoryId) {
    return categoriesInfo?.categories?.categories?.filter(c => c.id == categoryId)[0].description;
  }

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("size") ?? 4);
  const [page, setPage] = React.useState(initialPage - 1);
  const [ads, setAds] = React.useState(null);
  
  const dispatch = useDispatch();

  React.useEffect(() => {
    getCategoriesInfo(keycloak, dispatch);
    const params = new URLSearchParams(location.search);
    const backendParams = new URLSearchParams(params);
    backendParams.set("page", Number(params.get("page") ?? 1) - 1);
    backendParams.set("size", Number(params.get("pageSize") ?? 4));
    getAds(backendParams.toString(), (ads) => {
      ads = updateVisibilityAds(ads);
      setAds(ads);
      getUsersInfo(keycloak, ads, dispatch);
    });
  }, [])

  React.useEffect(() => {
    getUsersInfo(keycloak, ads, dispatch);
  }, [ads, keycloakLoggedIn]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const backendParams = new URLSearchParams(params);
    backendParams.set("page", Number(params.get("page") ?? 1) - 1);
    backendParams.set("size", Number(params.get("pageSize") ?? 4));
    getAds(backendParams.toString(), (ads) => {
      ads = updateVisibilityAds(ads);
      setAds(ads);
      getUsersInfo(keycloak, ads, dispatch);
    });
  }, [location.search]);

  const handlePageChange = (_, value) => {
    setPage(value - 1);
    setSearchParams({ page: value, size: pageSize });
  };

  const hideAdEditForm = (ad) => {
    let a = ads.content.filter(a => a.id === ad.id)[0];
    if(a) a.editFormHidden = true;
    setAds({...ads});
  }

  const showAdContactForm = (ad) => {
    let a = ads.content.filter(a => a.id === ad.id)[0];
    if(a) a.editFormHidden = false;
    setAds({...ads});
  }

  const updateVisibilityAds = (newAds) => {
    newAds.content.forEach(ad => {
      ad.editFormHidden = true;
    })
    if(!ads) return newAds;
    ads.content.forEach(sa => {
      let na = newAds.content.filter(na => na.id === sa.id)[0];
      if(na) {
        na.editFormHidden = sa.editFormHidden;
      }
    })
    return newAds;
  }

  const reloadAds = () => {
    const params = new URLSearchParams(location.search);
    const backendParams = new URLSearchParams(params);
    backendParams.set("page", Number(params.get("page") ?? 1) - 1);
    backendParams.set("size", Number(params.get("pageSize") ?? 4));
    getAds(backendParams.toString(), (ads) => {
      ads = updateVisibilityAds(ads);
      setAds(ads);
      getUsersInfo(keycloak, ads, dispatch);
    });
  }

  return (
    <Box sx={{ padding: 3, fontFamily: "Courier New, monospace" }}>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Lista ogłoszeń
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tytuł</TableCell>
              <TableCell>Treść</TableCell>
              <TableCell>Kategoria</TableCell>
              <TableCell>Ostatnia aktualizacja</TableCell>
              <TableCell>Użytkownik</TableCell>
              <TableCell align="right">Akcje</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {ads?.content?.map(ad => (
              
              <>
              
              <TableRow key={ad.id}>
                <TableCell>{ad.title}</TableCell>

                <TableCell>
                  {ad.content.length > 80
                    ? ad.content.substring(0, 80) + "..."
                    : ad.content}
                </TableCell>

                <TableCell>{getCategoryName(ad.category)}</TableCell>

                <TableCell>
                  {new Date(ad.updatedAt).toLocaleString()}
                </TableCell>

                <TableCell>
                  {usersInfoUtil.getUserName(usersInfo, ad.user)}
                </TableCell>

                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Pokaż
                  </Button>

                  { (userInfo && userInfo.user && userInfo.user.id != ad.user) && <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {showAdContactForm(ad);}}
                  >
                    Kontakt
                  </Button>
                  }

                </TableCell>
              </TableRow>

              {!ad.editFormHidden && <ContactAdInlineForm userInfo={userInfo} ad={ad} reloadAds={() => {
                hideAdEditForm(ad);
                reloadAds();
              }}/>}

             </>
            ))}

          </TableBody>

        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
            page={(ads?.number ?? 0) + 1}      // Spring → MUI
            count={ads?.totalPages ?? 1}       // liczba stron
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default AdsListPage;

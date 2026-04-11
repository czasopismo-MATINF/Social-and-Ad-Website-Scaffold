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

import { useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import * as Reducers from '../store/slice.js'

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

const AdsListPage = () => {
  
  const userInfo = useSelector(state => state.main.userInfo);
  const categoriesInfo = useSelector(state => state.main.categoriesInfo);

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
      setAds(ads);
    });
  }, [])

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const backendParams = new URLSearchParams(params);
    backendParams.set("page", Number(params.get("page") ?? 1) - 1);
    backendParams.set("size", Number(params.get("pageSize") ?? 4));
    getAds(backendParams.toString(), (ads) => {
      setAds(ads);
    });
  }, [location.search]);

  const handlePageChange = (_, value) => {
    setPage(value - 1);
    setSearchParams({ page: value, size: pageSize });
  };

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
                  {ad.user}
                </TableCell>

                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Pokaż
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                  >
                    Kontakt
                  </Button>
                </TableCell>
              </TableRow>

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

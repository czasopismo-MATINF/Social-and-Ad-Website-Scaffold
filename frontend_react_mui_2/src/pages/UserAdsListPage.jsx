import React from "react";
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

import { useSearchParams } from "react-router-dom";
import { useSelector } from 'react-redux';

import NewAdForm from '../components/NewAdForm.jsx'
import EditAdInlineForm from '../components/EditAdInlineForm.jsx'

function getUserAds(keycloak, userInfo, pageNumber, pageSize, setAds) {
    console.log("GETTING USER ADS");
    if(!keycloak.authenticated) {
      console.log("User not authenticated, skipping user info fetch");
      return;
    }
    fetch(`http://localhost:3020/ads?user=${userInfo.user.id}&page=${pageNumber}&size=${pageSize}&sort=updatedAt,desc&sort=title,asc`, {
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

async function deleteAd(keycloak, ad, reloadAds) {
  try {
    const response = await fetch(`http://localhost:3020/ads/${ad.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + keycloak.token
      }
    });

    if (!response.ok) {
      throw new Error("Błąd podczas usuwania ogłoszenia");
    }

    if(reloadAds) reloadAds();

  } catch (error) {
    console.error(error);
  }
};

const UserAdsListPage = () => {
  
  const userInfo = useSelector(state => state.main.userInfo);
  const categoriesInfo = useSelector(state => state.main.categoriesInfo);

  function getCategoryName(categoryId) {
    return categoriesInfo?.categories?.categories?.filter(c => c.id == categoryId)[0].description;
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("size") ?? 4);

  const [page, setPage] = React.useState(initialPage - 1);
  const [ads, setAds] = React.useState(null);
  
  React.useEffect(() => {
    if (userInfo && userInfo.user) {
        getUserAds(keycloak, userInfo, page, pageSize, setAds);
    }
  }, [userInfo, page]);

  const handlePageChange = (_, value) => {
    setPage(value - 1);
    setSearchParams({ page: value, size: pageSize });
  };

  const reloadAds = () => {
     getUserAds(keycloak, userInfo, page, pageSize, setAds);
  }

  return (
    <Box sx={{ padding: 3, fontFamily: "Courier New, monospace" }}>
    
      <NewAdForm reloadAds={reloadAds}/>

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

                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => console.log("EDIT", ad.id)}
                  >
                    Edytuj
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteAd(keycloak, ad, reloadAds)}
                  >
                    Usuń
                  </Button>
                </TableCell>
              </TableRow>

              <EditAdInlineForm ad={ad} reloadAds={reloadAds} />
              
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

export default UserAdsListPage;

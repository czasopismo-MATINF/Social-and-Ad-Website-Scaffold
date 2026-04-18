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
  Modal
} from "@mui/material";

import usersInfoUtil from "../usersInfoUtil.js"
import connectUtil from "../connectUtil.js"

import { useSelector, useDispatch } from 'react-redux';

import ContactAdInlineForm from '../components/ContactAdInlineForm.jsx'
import AdsFilterForm from '../components/AdsFilterForm.jsx'

import userInfoPageConfig from '../userInfoPageConfig'

const AdsListPage = () => {
  
  const userInfo = useSelector(state => state.main.userInfo);
  const categoriesInfo = useSelector(state => state.main.categoriesInfo);
  const keycloakLoggedIn = useSelector(state => state.main.keycloakLoggedIn);
  const usersInfo = useSelector(state => state.main.usersInfo);

  function getCategoryName(categoryId) {
    return categoriesInfo?.categories?.categories?.filter(c => c.id == categoryId)[0].description;
  }

  const [ads, setAds] = React.useState(null);
  
  const dispatch = useDispatch();

  React.useEffect(() => {
    connectUtil.getCategoriesInfo(dispatch);
    const params = new URLSearchParams(window.location.search);
    const backendParams = new URLSearchParams(params);
    backendParams.set("page", Number(params.get("page") ?? 1) - 1);
    backendParams.set("size", Number(params.get("size") ?? 4));
    connectUtil.getAds(backendParams.toString(), (ads) => {
      ads = updateVisibilityAds(ads);
      setAds(ads);
      connectUtil.getUsersInfo(ads, usersInfo, dispatch);
    });
  }, [])

  React.useEffect(() => {
    connectUtil.getUsersInfo(ads, usersInfo, dispatch);
  }, [ads, keycloakLoggedIn]);

  const handlePageChange = (_, value) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", value);
    params.set("size", Number(params.get("size") ?? 4));
    window.history.pushState({}, "", `${location.pathname}?${params.toString()}`);
    const backendParams = new URLSearchParams(params);
    backendParams.set("page", Number(params.get("page")) - 1);
    backendParams.set("size", Number(params.get("size") ?? 4));
    connectUtil.getAds(backendParams.toString(), (ads) => {
      ads = updateVisibilityAds(ads);
      setAds(ads);
      connectUtil.getUsersInfo(ads, usersInfo, dispatch);
    });
  };

  const hideAdContactForm = (ad) => {
    let a = ads.content.filter(a => a.id === ad.id)[0];
    if(a) a.editFormHidden = true;
    setAds({...ads});
  }

  const showAdContactForm = (ad) => {
    let a = ads.content.filter(a => a.id === ad.id)[0];
    if(a) {
      a.editFormHidden = !a.editFormHidden;
    }
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

const searchForAds = (filterParams) => {
  const original = new URLSearchParams(window.location.search);
  const result = new URLSearchParams();

  const filterKeys = [...new Set(filterParams.keys())];

  for (const key of new Set(filterParams.keys())) {
    original.delete(key);
  }

  // 1. Przejdź po kluczach z URL w oryginalnej kolejności
  for (const key of original.keys()) {
    if (filterParams.has(key)) {
      // wstaw wszystkie wartości z filterParams
      for (const value of filterParams.getAll(key)) {
        result.append(key, value);
      }
      filterKeys.splice(filterKeys.indexOf(key), 1); // usuń z listy do dodania
    } else {
      // zachowaj oryginalne wartości
      /*
      for (const value of original.getAll(key)) {
        result.append(key, value);
      }
      */
    }
  }

  // 2. Dodaj klucze, które są tylko w filterParams
  for (const key of filterKeys) {
    for (const value of filterParams.getAll(key)) {
      result.append(key, value);
    }
  }

  // 3. Ustaw page/size
  result.set("page", Number(original.get("page") ?? 1));
  result.set("size", Number(original.get("size") ?? 4));

  // 4. Aktualizacja URL
  window.history.pushState({}, "", `${location.pathname}?${result.toString()}`);

  // 4.5. Przygotowanie parametrów do wywoładnia backendu.
  const backendParams = new URLSearchParams(result);
  backendParams.set("page", Number(result.get("page")) - 1);

  // 5. Wywołanie backendu
  connectUtil.getAds(backendParams.toString(), (ads) => {
    ads = updateVisibilityAds(ads);
    setAds(ads);
    connectUtil.getUsersInfo(ads, usersInfo, dispatch);
  });
};

  const [openModal, setOpenModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const showAdModal = (ad) => {
    setSelectedAd(ad);
    setOpenModal(true);
  };
  const closeAdModal = () => {
    setOpenModal(false);
    setSelectedAd(null);
  };

  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const showUserModal = (u) => {
    setSelectedUser(usersInfoUtil.getCompleteUserInfo(usersInfo, u));
    setOpenUserModal(true);
  };
  const closeUserModal = (u) => {
    setOpenUserModal(false);
    setSelectedUser(null);
  };

  return (
    <Box sx={{ padding: 3, fontFamily: "Courier New, monospace" }}>

      <AdsFilterForm categories={(categoriesInfo === null) ? [] : categoriesInfo.categories.categories} onFilterChange={(data) => {searchForAds(data)}} />

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
                    onClick={() => showAdModal(ad)}
                  >
                    Pokaż
                  </Button>

                  { (userInfo && userInfo.user && userInfo.user.id != ad.user) && <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {showUserModal(ad.user);}}
                  >
                    Info
                  </Button>
                  }

                  { (userInfo && userInfo.user && userInfo.user.id != ad.user) && <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {showAdContactForm(ad);}}
                  >
                    {ad.editFormHidden ? "Kontakt" : "Ukryj kontakt"}
                  </Button>
                  }

                </TableCell>
              </TableRow>

              {!ad.editFormHidden && <ContactAdInlineForm userInfo={userInfo} ad={ad} reloadAds={() => {
                hideAdContactForm(ad);
                //reloadAds();
              }}/>}

             </>
            ))}

          </TableBody>

        </Table>
      </TableContainer>


    <Modal
      open={openModal}
      onClose={closeAdModal}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3
        }}
      >
        {selectedAd && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedAd.title}
            </Typography>

            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {selectedAd.content}
            </Typography>

            <Button
              variant="outlined"
              sx={{ mt: 3, float: "right" }}
              onClick={closeAdModal}
            >
              Zamknij
            </Button>
          </>
        )}
      </Box>
    </Modal>


    <Modal
      open={openUserModal}
      onClose={closeUserModal}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3
        }}
      >
        {selectedUser && (
          <>
            {userInfoPageConfig.attributes.map((attr) => {
              return <Typography variant="h6" sx={{ mb: 2 }}>
                {attr.attributeDisplayName} : {selectedUser.attributes.find(a => a.attributeName === attr.attributeName).attributeValue}
              </Typography>
            })} 
            
            <Button
              variant="outlined"
              sx={{ mt: 3, float: "right" }}
              onClick={closeUserModal}
            >
              Zamknij
            </Button>
          </>
        )}
      </Box>
    </Modal>


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

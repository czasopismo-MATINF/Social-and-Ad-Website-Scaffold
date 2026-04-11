import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import ChatPage from "./pages/ChatPage";
import UserAdsListPage from "./pages/UserAdsListPage";
import AdsListPage from "./pages/AdsListPage";

import { useSelector, useDispatch } from 'react-redux'

import keycloak from "./keycloak.js";

import * as Reducers from './store/slice.js'

function getUserInfo(keycloak, dispatch) {
    console.log("GETTING USER INFO");
    if(!keycloak.authenticated) {
      console.log("User not authenticated, skipping user info fetch");
      return;
    }
    fetch(`http://localhost:3020/users/${keycloak.tokenParsed?.preferred_username}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + keycloak.token,
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(data => {
      console.log("USER INFO FETCHED", data);
      dispatch(Reducers.userInfoCollected(data));
    });
}

function getCategoriesInfo(keycloak, dispatch) {
    console.log("GETTING CATEGORIES INFO");
    if(!keycloak.authenticated) {
      console.log("User not authenticated, skipping user info fetch");
      return;
    }
    fetch(`http://localhost:3020/categories`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + keycloak.token,
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(data => {
      console.log("CATEGORIES INFO FETCHED", data);
      dispatch(Reducers.categoriesInfoCollected(data));
    });
}

const App = () => {

  const dispatch = useDispatch();

  React.useEffect(() => {
    
    keycloak.onAuthSuccess = () => {
      console.log("Keycloak onAuthSuccess");
      dispatch(Reducers.keycloakLoggedIn());
      getUserInfo(keycloak, dispatch);
      getCategoriesInfo(keycloak, dispatch);
    };

    keycloak.onAuthLogout = () => {
      console.log("Keycloak onAuthLogout");
      dispatch(Reducers.keycloakLoggedOut());
    };

    keycloak.onTokenExpired = () => {
      console.log("Token expired → refreshing");
      keycloak.updateToken(30);
    };

    keycloak.init({ onLoad: "check-sso" })
    .then(() => {
      if (keycloak.authenticated) {
        console.log("Keycloak logged in.");
        //dispatch(keycloakLoggedIn());
        //getUserInfo(keycloak, dispatch);
        //getCategoriesInfo(keycloak, dispatch);
        //connectToWebSocket(keycloak, dispatch);
      } else {
        //console.log("Keycloak logged out.");
        //dispatch(Reducers.keycloakLoggedOut());
      }
    })
    .catch(err => console.error("Keycloak init error:", err));

    //connectToWebSocket(keycloak, dispatch);

  }, []);

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<div>Witaj na stronie głównej</div>} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/userads" element={<UserAdsListPage />} />
          <Route path="/ads" element={<AdsListPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;

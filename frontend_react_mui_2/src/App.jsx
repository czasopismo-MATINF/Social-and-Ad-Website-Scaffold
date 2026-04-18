import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import UserAdsListPage from "./pages/UserAdsListPage.jsx";
import AdsListPage from "./pages/AdsListPage.jsx";
import UserInfoPage from "./pages/UserInfoPage.jsx";
import UserInfoEditRawPage from "./pages/UserInfoEditRawPage.jsx";
import UserInfoEditPage from "./pages/UserInfoEditPage.jsx";
import MainPage from "./pages/MainPage.jsx";

import { useSelector, useDispatch } from 'react-redux'

import keycloak from "./keycloak.js";
import WebSocket from "./websocket.js";
import connectUtil from "./connectUtil.js"

import * as Reducers from './store/slice.js'

const App = () => {

  const dispatch = useDispatch();

  React.useEffect(() => {
    
    keycloak.onAuthSuccess = () => {

      console.log("Keycloak onAuthSuccess");
      dispatch(Reducers.keycloakLoggedIn());

      connectUtil.getSelfInfo(keycloak, dispatch);
      connectUtil.getCategoriesInfo(keycloak, dispatch);

      WebSocket.connectToWebSocket((msg) => {
        dispatch(Reducers.addFreshMessage(msg));
      });
      
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
      } else {
        console.log("Keycloak not authenticated.");
      }
    })
    .catch(err => console.error("Keycloak init error:", err));

  }, []);

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/userads" element={<UserAdsListPage />} />
          <Route path="/ads" element={<AdsListPage />} />
          <Route path="/userinfo" element={<UserInfoPage />} />
          <Route path="/userinfoedit" element={<UserInfoEditPage />} />
          <Route path="/userinfoeditraw" element={<UserInfoEditRawPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;

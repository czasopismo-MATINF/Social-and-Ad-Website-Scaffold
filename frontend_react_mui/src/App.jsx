import { useState, useEffect } from 'react'
import './App.css'
import './Custom.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import keycloak from "./keycloak.js";

import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, keycloakLoggedIn, keycloakLoggedOut, userInfoCollected, categoriesLoaded } from '../store/slice.js'

import { Button } from '@mui/material'

import Blog from '../blog/Blog.jsx'
import UI from './wrappers/UI.jsx'

import UserInfoComponent from './UserInfoComponent.jsx';
import UserInfoComponentFieldSettings from './UserInfoComponentFieldSettings.jsx';
import EditUserInfoComponent from './EditUserInfoComponent.jsx'
import EditUserInfoComponentFieldSettings from './EditUserInfoComponentFieldSettings.jsx'
import EditAdsComponent from './wrappers/EditAdsComponent.jsx'
import EditAdComponent from './wrappers/EditAdComponent.jsx'
import NewAdFormComponent from './components/NewAdFormComponent.jsx'

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
      dispatch(userInfoCollected(data));
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
      dispatch(categoriesLoaded(data));
    });
}

function Main() {
  return <UI>
    Main
  </UI>
}

function Info() {
  const userInfo = useSelector(state => state.example.userInfo);
  return <UI>
     <UserInfoComponentFieldSettings userInfo={userInfo}  />
  </UI>
}

function InfoRaw() {
  const userInfo = useSelector(state => state.example.userInfo);
  return <UI>
     <UserInfoComponent userInfo={userInfo}  />
  </UI>
}

function Edit() {
  const userInfo = useSelector(state => state.example.userInfo);
  return <UI>
    <EditUserInfoComponentFieldSettings />
  </UI>
}

function EditRaw() {
  const userInfo = useSelector(state => state.example.userInfo);
  return <UI>
    <EditUserInfoComponent />
  </UI>
}

function EditAds() {
  const userInfo = useSelector(state => state.example.userInfo);
  return <EditAdsComponent>
    <NewAdFormComponent />
  </EditAdsComponent>
}

function EditAdPage() {
  const userInfo = useSelector(state => state.example.userInfo);
  return <EditAdComponent />
}

function A() {
  // Odczytaj wartość licznika ze stanu
  const counter = useSelector(state => state.example.counter)
  
  // Pobierz funkcję dispatch
  const dispatch = useDispatch()

  return <>
    <div>
      <h1>Licznik: {counter}</h1>
      
      {/* Zwiększ licznik */}
      <button onClick={() => dispatch(increment())}>
        Zwiększ (+)
      </button>
      
      {/* Zmniejsz licznik */}
      <button onClick={() => dispatch(decrement())}>
        Zmniejsz (-)
      </button>

      <Button component={Link} to="/dashboard/keycloak" variant="contained">Keycloak</Button>
    </div>
  </>
}

function B() {
  return <>
      <div>
      {!keycloak.authenticated ? (
        <>
          <p>Nie jesteś zalogowany</p>
          <button onClick={() => keycloak.login()}>Zaloguj</button>
        </>
      ) : (
        <>
          <p>Witaj, {keycloak.tokenParsed?.preferred_username}</p>
          {
            testApi(keycloak)
          }
          <button onClick={() => keycloak.logout()}>Wyloguj</button>
        </>
      )}
      <Button component={Link} to="/dashboard/counter" variant="contained">Counter</Button>
    </div>
  </>
}

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    keycloak.init({ onLoad: "check-sso" })
    .then(() => {
      if (keycloak.authenticated) {
        dispatch(keycloakLoggedIn());
        getUserInfo(keycloak, dispatch);
        getCategoriesInfo(keycloak, dispatch);
      } else {
        dispatch(keycloakLoggedOut());
      }
    })
    .catch(err => console.error("Keycloak init error:", err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Main />} />
        <Route path="/info" element={<Info />} />
        <Route path="/inforaw" element={<InfoRaw />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/editraw" element={<EditRaw />} />
        <Route path="/editads" element={<EditAds />} />
        <Route path="/editads/edit/:id" element={<EditAdPage />} />

        <Route path="/dashboard">
          <Route index element={<Blog />} />
          <Route path="ui" element={<UI />} />
          <Route path="keycloak" element={ <B /> } />
          <Route path="counter" element={ <A /> } />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

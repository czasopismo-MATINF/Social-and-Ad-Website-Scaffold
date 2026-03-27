import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { useEffect } from "react";
import keycloak from "./keycloak.js";

import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, keycloakLoggedIn, keycloakLoggedOut, userInfoCollected } from '../store/slice.js'

import { Link as MuiLink } from '@mui/material'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

import Blog from '../blog/Blog.jsx'
import UI from './UI.jsx'

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
      dispatch(userInfoCollected(data));
    });

}

function Main() {
  return <UI>
    Main
  </UI>
}

function UserInfoComponent({ userInfo }) {
  
  if (!userInfo) {
    return <p>Brak danych użytkownika.</p>;
  }

  return (
    <>
      {userInfo.attributes.map((e) => (
        <p key={e.attributeName}>{e.attributeName}: {String(e.attributeValue)}</p>
      ))}
    </>
  );

}

function Info() {
  const userInfo = useSelector(state => state.example.userInfo);
  return <UI>
     <UserInfoComponent userInfo={userInfo}  />
  </UI>
}

function Edit() {

  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.example.userInfo);
  const [formState, setFormState] = useState({
    attributes: []
  });

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    setFormState({
      attributes: Array.isArray(userInfo.attributes) ? userInfo.attributes.map((attr) => ({
            attributeName: attr.attributeName ?? attr.name ?? '',
            attributeValue: attr.attributeValue ?? attr.value ?? ''
          }))
        : []
    });
  }, [userInfo]);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAttributeChange = (index, field) => (event) => {
    setFormState((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, idx) =>
        idx === index ? { ...attr, [field]: event.target.value } : attr
      )
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInfo) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3020/users/${keycloak.tokenParsed?.preferred_username}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...userInfo,
          attributes: formState.attributes
        })
      });

      if (!response.ok) {
        throw new Error(`Aktualizacja nie powiodła się: ${response.status}`);
      }

      const updatedData = await response.json();
      dispatch(userInfoCollected(updatedData));
      //alert('Dane użytkownika zostały zapisane.');
    } catch (error) {
      console.error('Błąd zapisu danych użytkownika:', error);
      //alert('Nie udało się zapisać zmian. Sprawdź konsolę.');
    }
  };

  if (!userInfo) {
    return (
      <UI>
        <p>Brak danych użytkownika.</p>
      </UI>
    );
  }

  return (
    <UI>
      <form onSubmit={handleSubmit}>
        {formState.attributes.map((attr, index) => (
          <div key={index}>
            <label>
              Atrybut:
              <input
                type="text"
                value={attr.attributeName}
                onChange={handleAttributeChange(index, 'attributeName')}
              />
            </label>
            <label>
              Wartość:
              <input
                type="text"
                value={attr.attributeValue}
                onChange={handleAttributeChange(index, 'attributeValue')}
              />
            </label>
          </div>
        ))}
        <button type="submit">Zapisz zmiany</button>
      </form>
    </UI>
  );
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
        <Route path="/edit" element={<Edit />} />

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

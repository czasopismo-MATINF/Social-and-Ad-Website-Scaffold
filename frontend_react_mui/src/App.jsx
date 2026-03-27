import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { useEffect } from "react";
import keycloak from "./keycloak.js";

import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from '../store/slice.js'

import { Link as MuiLink } from '@mui/material'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

function testApi(keycloak) {

    console.log("TESTING API");
    console.log(keycloak.tokenParsed);

    fetch("http://localhost:3020/users/mikolaj", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + keycloak.token,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => console.log(data));

}

import Blog from '../blog/Blog.jsx'
import UI from './ui.jsx'

function A() {
  return <UI />
}

function AStare() {
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

      <Button component={Link} to="/about" variant="contained">About</Button>
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
      <Button component={Link} to="/" variant="contained">Main</Button>
    </div>
  </>
}

function C() {
   return <Blog />
}

function D() {
  return <UI />
}

function App() {

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
  keycloak.init({ onLoad: "check-sso" })
    .then(() => setInitialized(true))
    .catch(err => console.error("Keycloak init error:", err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<A />} />
        <Route path="/about" element={<B />} />
        <Route path="/dashboard">
          <Route index element={<C />} />
          <Route path="settings" element={<D />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function InitApp() {

  const [count, setCount] = useState(0)

return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>

    </>
  )
}

export default App

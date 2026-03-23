import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from "react";
import keycloak from "./keycloak";

function testApi(keycloak) {

    console.log("TESTING API");
    console.log(keycloak.tokenParsed);
/*
    fetch("http://localhost:8080/users/mikolaj", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + keycloak.token,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => console.log(data));
*/
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

function App() {

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: "check-sso" })
      .then(() => setInitialized(true))
      .catch(err => console.error("Keycloak init error:", err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      
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
    </div>
    </div>
  );
}

export default App;

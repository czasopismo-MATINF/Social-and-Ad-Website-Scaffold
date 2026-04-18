import keycloak from "./keycloak.js";
import * as Reducers from './store/slice.js'

export default {

    getUserInfo : (keycloak, userId, callback) => {
        console.log("GETTING OTHER USER INFO");
        if(!keycloak.authenticated) {
            console.log("User not authenticated, skipping user info fetch");
            return;
        }
        fetch(`http://localhost:3020/users/id/${userId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + keycloak.token,
            "Content-Type": "application/json"
        }
        }).then(res => res.json())
        .then(data => {
            console.log("OTHER USER INFO FETCHED", data);
            if(callback) callback(data);
        });
    },

    getSelfInfo : (keycloak, dispatch) => {
        console.log("GETTING USER INFO");
        if(!keycloak.authenticated) {
            console.log("User not authenticated, skipping user info fetch");
            return;
        }
        fetch(`http://localhost:3020/users/username/${keycloak.tokenParsed?.preferred_username}`, {
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
    },

    getCategoriesInfo : (keycloak, dispatch) => {
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
    
};

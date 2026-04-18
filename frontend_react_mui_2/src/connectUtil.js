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

    getSelfInfo : (dispatch) => {
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

    getCategoriesInfo : (dispatch) => {
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
    },

    getUserAds : (userInfo, pageNumber, pageSize, callback) => {
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
            if(callback) callback(data);
        });
    },

    deleteAd : async (ad, reloadAds) => {
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
    },
    
};

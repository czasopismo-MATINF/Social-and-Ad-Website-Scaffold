import keycloak from "./keycloak.js";
import * as Reducers from './store/slice.js'

function getUserInfo(userId, callback) {
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
}

function getConversation(conversationId, number, before, callback) {
    console.log("GETTING USER CONVERSATION");
    if(!keycloak.authenticated) {
        console.log("User not authenticated, skipping conversations fetch");
        return;
    }
    const url = `http://localhost:3020/conversations/${conversationId}?withMessages=true&number=${number}${
        before ? `&before=${before}` : ""
    }`;
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + keycloak.token,
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => {
        console.log("USER CONVERSATION FETCHED", data);
        if(callback) callback(data);
    });
}

export default {

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

    getAds : (queryString, callback) => {
        console.log("GETTING ADS");
        console.log(`http://localhost:3020/ads?${queryString}`);
        fetch(`http://localhost:3020/ads?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
          .then(data => {
            console.log("ADS FETCHED", data);
            if(callback) callback(data);
        });
    },

    getUsersInfoByIds : (userIds, usersInfo, dispatch) => {
        console.log("GETTING USERS INFO", userIds);
        if(!Array.isArray(userIds)) return;
        const uitf = new Map();
        for(const u of userIds) {
            uitf.set(u, u);
        }
        for(const ui of usersInfo) {
            uitf.delete(ui.id);
        }
        for(const u of uitf.keys()) {
            getUserInfo(u, (data) => {
                dispatch(Reducers.anotherUserInfoCollected(data));
            });
        }
    },

    getConversations : (userInfo, number, before, callback) => {
        console.log("GETTING USER CONVERSATIONS");
        if(!keycloak.authenticated) {
            console.log("User not authenticated, skipping conversations fetch");
            return;
        }
        const url = `http://localhost:3020/conversations?participants=${userInfo.user.id}&number=${number}${
            before ? `&before=${before}` : ""
        }`;
        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + keycloak.token,
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
          .then(data => {
            console.log("USER CONVERSATIONS FETCHED", data);
            if(callback) callback(data);
        });
    },

    getConversationsWithMessages : (conversations, number, before, callback) => {
        conversations.forEach(conv => {
            getConversation(conv.id, number, before, (data) => {
                if(callback) callback(data);
            })
        })
    },

    getConversationWithParticipants : (conversationId, callback) => {
        getConversation(conversationId, 5, null, (data) => {
            if(callback) callback(data)
        });
    },

    getConversationWithOlderMessages : (conversationId, number, before, callback) => {
        getConversation(conversationId, number, before, callback);
    },

    sendMsg : (conversationId, userInfo, msg, callback) => {
        console.log("SENDING MSG TO CONVERSATION");
        if(!keycloak.authenticated) {
            console.log("User not authenticated, skipping conversations fetch");
            return;
        }
        const url = `http://localhost:3020/conversations/${conversationId}/messages`;
        const msgForm = {
            from : userInfo.user.id,
            conversationId : conversationId,
            content: msg
        };
        fetch(url, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + keycloak.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(msgForm)
        }).then(res => res.json())
          .then(data => {
            console.log("MESSAGE SENT", data);
            if(callback) callback(data);
          })
    },

};

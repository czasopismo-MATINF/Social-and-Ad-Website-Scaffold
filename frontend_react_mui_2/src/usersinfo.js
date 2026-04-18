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
    getUserName : (usersInfo, userId) => {
        const user = usersInfo.filter(u => u.id === userId)[0];
        if(!user) {
            return "nieznany";
        } else {
            const name = user.attributes.filter(a => a.attributeName === 'name')[0].attributeValue;
            const lastName = user.attributes.filter(a => a.attributeName === 'last name')[0].attributeValue;
            return `${name} ${lastName}`;
        }
    },
    getCompleteUserInfo : (usersInfo, userId) => {
        return usersInfo.filter(u => u.id === userId)[0];
    }
}
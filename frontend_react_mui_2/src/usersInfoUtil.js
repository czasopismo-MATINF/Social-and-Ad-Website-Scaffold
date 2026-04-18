export default {
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
    },
    getDisplayName : (userInfo) => {
        if(!userInfo || !userInfo.user) return ``;
        let name = userInfo.user.attributes.filter(a => a.attributeName === "name")[0].attributeValue;
        let lastName = userInfo.user.attributes.filter(a => a.attributeName === "last name")[0].attributeValue;
        return `${name} ${lastName}`
    },
}
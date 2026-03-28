const userInfoPageConfig = {
    "attributes" : [
        { attributeName: "name", "attributeDisplayName": "Imię"},
        { attributeName: "last name", "attributeDisplayName": "Nazwisko"},
        { attributeName: "phone", "attributeDisplayName": "Telefon"},
        { attributeName: "fb page", "attributeDisplayName": "Strona na FB"},
        { attributeName: "li page", "attributeDisplayName": "Strona na LI"},
        { attributeName: "description", "attributeDisplayName": "Opis", "multiline": true},
        { attributeName: "locations", "attributeDisplayName": "Lokalizacje", "array": true},
        { attributeName: "accessibility", "attributeDisplayName": "Dostępność", "multichoice": true, "options": ["Na miejscu", "Z dojazdem", "Online"]},
        { attributeName: "yt page", "attributeDisplayName": "Strona na YT"},
    ]
};

export default userInfoPageConfig;

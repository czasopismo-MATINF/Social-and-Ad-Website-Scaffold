import React from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

import MessageInput from "../components/MessageInput";

import keycloak from "../keycloak.js";

import { useSelector, useDispatch } from 'react-redux';
import * as Reducers from '../store/slice.js'

import ChatMessages from '../components/ChatMessages.jsx'

import usersInfoUtil from "../usersinfo.js"

function getConversations(keycloak, userInfo, number, before, callback) {
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
}

function getConversation(keycloak, userInfo, conversationId, number, before, callback) {
    console.log("GETTING USER CONVERSATION");
    if(!keycloak.authenticated) {
      console.log("User not authenticated, skipping conversations fetch");
      return;
    }
    const url = `http://localhost:3020/conversations/${conversationId}?withMessages=true&number=${number}${
      before ? `&before=${before}` : ""
    }`;

    //console.log(url);
    
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

function getConversationsWithMessages(conversations, keycloak, userInfo, callback) {
  conversations.forEach(conv => {
    getConversation(keycloak, userInfo, conv.id, 5, null, (data) => {
      if(callback) callback(data);
    })
  })
}

function getConversationWithOlderMessages(keycloak, userInfo, conversationId, number, before, callback) {
    console.log("GETTING OLDER MESSAGES");
    if(!keycloak.authenticated) {
      console.log("User not authenticated, skipping conversations fetch");
      return;
    }
    const url = `http://localhost:3020/conversations/${conversationId}?withMessages=true&number=${number}${
      before ? `&before=${before}` : ""
    }`;
    
    console.log(url);

    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + keycloak.token,
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(data => {
      console.log("OLDER MESSAGES FETCHED", data);
      if(callback) callback(data);
    });
}

const getOldestConversation = (conversations) => {
  if (!conversations.length) return null;
  return conversations.reduce((oldest, conv) =>
    new Date(conv.updatedAt) < new Date(oldest.updatedAt) ? conv : oldest
  );
};

const sendMsg = (conversationId, userInfo, msg, callback) => {
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
    })
    /*.then(res => res.json())
    .then(data => {
      console.log("MSG SENT", data);
      if(callback) callback(data);
    });*/

}

function getConversationWithParticipants(conversationId, keycloak, userInfo, callback) {
  getConversation(keycloak, userInfo, conversationId, 2, null, (data) => {
    if(callback) callback(data)
  })
}

const ChatPage = () => {

  const userInfo = useSelector(state => state.main.userInfo);
  const conversations = useSelector(state => state.main.conversations);
  const usersInfo = useSelector(state => state.main.usersInfo);

  const [activeConversation, setActiveConversation] = React.useState(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    for(let conv of conversations.conversations) {
      if(!Array.isArray(conv.participants)) {
        getConversationWithParticipants(conv.id, keycloak, userInfo, (data) => {
            dispatch(Reducers.updateConversationParticipants(data));
        })
      } else {
        conv.participants.forEach(p => {
          usersInfoUtil.getUserInfo(keycloak, p, (data) => {
            dispatch(Reducers.anotherUserInfoCollected(data));
          })
      });
      }
    }
  }, [conversations]);

  React.useEffect(() => {
    if(userInfo && userInfo.user) {
      getConversations(keycloak, userInfo, 1, null, (data) => {
        dispatch(Reducers.addConversations(data));
        if(data.conversations.length >= 1) {
          setActiveConversation(data.conversations[0].id);
        }
        getConversationsWithMessages(data.conversations, keycloak, userInfo, (data) => {
          dispatch(Reducers.addConversationWithMessages(data));
        });
      });
    }
  }, [userInfo]);

  const moreConversations = () => {
    const oldestConversation = getOldestConversation(conversations.conversations);
    const before = oldestConversation.updatedAt;
    getConversations(keycloak, userInfo, 2, before, (data) => {
      dispatch(Reducers.addConversations(data));
      getConversationsWithMessages(data.conversations, keycloak, userInfo, (data) => {
        dispatch(Reducers.addConversationWithMessages(data));
      });
    });
  }

  const sendMsgToActiveChannel = (msg) => {
    if(activeConversation) {
      sendMsg(activeConversation, userInfo, msg, null);
    }
  }

  const moreMessages = (conversationId) => {
    const conv = conversations.conversations.find(c => c.id === conversationId);
    const oldest = new Date(
      Math.min(...conv.messages.map(o => new Date(o.createdAt)))
    );
    getConversationWithOlderMessages(keycloak, userInfo, conversationId, 3, oldest.toISOString(), (c) => {
      dispatch(Reducers.olderMessagesArrived(c));
    });
  }

  const getOtherParticipantName = (conversationId) => {
    const participants = conversations.conversations.filter(c => c.id === conversationId)[0]?.participants;
    const otherFirstUser = participants?.filter(p => p !== userInfo.user.id)[0];
    if(otherFirstUser === undefined) {
      return "SELF";
    } else {
      return usersInfoUtil.getUserName(usersInfo, otherFirstUser);
    }
  }

  const messages=conversations.conversations.filter(c => c.id == activeConversation)[0]

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        padding: 2,
        gap: 2,
        fontFamily: "Courier New, monospace"
      }}
    >

      {/* Lewa kolumna */}
      <Box
        sx={{
          width: "30%",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          minHeight: 0,
          p: 2,
        }}
      >
        <Typography variant="h6">Konwersacje</Typography>

        <MessageInput onSend={(msg) => sendMsgToActiveChannel(msg)} />

        {conversations?.conversations?.map((_, i) => (
            <Typography
              key={i}
              onClick={() => setActiveConversation(_.id)}
              sx={{
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                backgroundColor: _.id === activeConversation ? "#e3f2fd" : "transparent",
                fontWeight: _.id === activeConversation ? "bold" : "normal",
                "&:hover": {
                  backgroundColor: "#f0f0f0"
                }
              }}
            >
              {getOtherParticipantName(_.id)}
            </Typography>
        ))}
        <Button
        variant='outlined'
        color='primary'
        sx={{ mr: 1 }}
        onClick={moreConversations}
        >
          Więcej
        </Button>
      </Box>

      {/* PRAWA KOLUMNA — CHAT */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#fafafa",
          padding: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto"
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Wiadomości
        </Typography>

        { (activeConversation !== null && messages !== undefined) &&
         <ChatMessages messages={messages.messages} userInfo={userInfo} moreMessages={moreMessages} conversationId={activeConversation}/>
        }
      </Box>
    </Box>
  );
};

export default ChatPage;

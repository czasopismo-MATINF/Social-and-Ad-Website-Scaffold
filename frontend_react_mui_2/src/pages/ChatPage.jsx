import React from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

import MessageInput from "../components/MessageInput";
import ChatMessages from '../components/ChatMessages.jsx'

import { useSelector, useDispatch } from 'react-redux';
import * as Reducers from '../store/slice.js'

import usersInfoUtil from "../usersInfoUtil.js"
import connectUtil from "../connectUtil.js"

const ChatPage = () => {

  const userInfo = useSelector(state => state.main.userInfo);
  const conversations = useSelector(state => state.main.conversations);
  const usersInfo = useSelector(state => state.main.usersInfo);

  const [activeConversation, setActiveConversation] = React.useState(null);
  const dispatch = useDispatch();

  const getOldestConversation = (conversations) => {
    if (!conversations.length) return null;
    return conversations.reduce((oldest, conv) =>
      new Date(conv.updatedAt) < new Date(oldest.updatedAt) ? conv : oldest
    );
  };

  React.useEffect(() => {
    for(let conv of conversations.conversations) {
      if(!Array.isArray(conv.participants)) {
        connectUtil.getConversationWithParticipants(conv.id, (data) => {
            dispatch(Reducers.updateConversationParticipants(data));
        })
      }
    }
    const allParticipants = conversations.conversations.flatMap(c =>
      Array.isArray(c.participants) ? c.participants : []
    );
    connectUtil.getUsersInfoByIds(allParticipants, usersInfo, dispatch);
  }, [conversations]);

  React.useEffect(() => {
    if(userInfo && userInfo.user) {
      connectUtil.getConversations(userInfo, 1, null, (data) => {
        dispatch(Reducers.addConversations(data));
        if(data.conversations.length >= 1) {
          setActiveConversation(data.conversations[0].id);
        }
        connectUtil.getConversationsWithMessages(data.conversations, 5, null, (data) => {
          dispatch(Reducers.addConversationWithMessages(data));
        });
      });
    }
  }, [userInfo]);

  const sendMsgToActiveChannel = (msg) => {
    if(activeConversation) {
      connectUtil.sendMsg(activeConversation, userInfo, msg, null);
    }
  }

  const moreConversations = () => {
    const oldestConversation = getOldestConversation(conversations.conversations);
    const before = oldestConversation?.updatedAt;
    connectUtil.getConversations(userInfo, 2, before, (data) => {
      dispatch(Reducers.addConversations(data));
      connectUtil.getConversationsWithMessages(data.conversations, 5, before, (data) => {
        dispatch(Reducers.addConversationWithMessages(data));
      });
    });
  }

  const moreMessages = (conversationId) => {
    const conv = conversations.conversations.find(c => c.id === conversationId);
    const oldest = new Date(
      Math.min(...conv.messages.map(o => new Date(o.createdAt)))
    );
    connectUtil.getConversationWithOlderMessages(conversationId, 3, oldest.toISOString(), (c) => {
      dispatch(Reducers.olderMessagesArrived(c));
    });
  }

  const getOtherParticipantName = (conversationId) => {
    const participants = conversations.conversations.filter(c => c.id === conversationId)[0]?.participants;
    const otherFirstUser = participants?.filter(p => p !== userInfo.user.id)[0];
    if(otherFirstUser === undefined) {
      return "NIEZNANY";
    } else {
      return usersInfoUtil.getUserName(usersInfo, otherFirstUser);
    }
  }

  const messages=conversations?.conversations?.filter(c => c.id == activeConversation)[0]

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

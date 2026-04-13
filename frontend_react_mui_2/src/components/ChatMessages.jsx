import React from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

import keycloak from "../keycloak.js";

import { useSelector, useDispatch } from 'react-redux';
import * as Reducers from '../store/slice.js'

export default function ChatMessages(props) {

    const conversations = useSelector(state => state.main.conversations);
    const dispatch = useDispatch();

    return (
        <>
        {props.messages.map(msg => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.senderId === props.userInfo.user.id ? "flex-end" : "flex-start"
            }}
          >
            <Paper
              elevation={2}
              sx={{
                padding: "8px 12px",
                maxWidth: "70%",
                backgroundColor: msg.senderId === props.userInfo.user.id ? "#ffffff" : "#d1e7ff",
                borderRadius: 2,
                whiteSpace: "pre-wrap"
              }}
            >
              {msg.content}
            </Paper>
          </Box>
        ))}</>
    )
}
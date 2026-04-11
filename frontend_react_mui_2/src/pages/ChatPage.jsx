import React from "react";
import { Box, Typography, Paper, TextField } from "@mui/material";

import MessageInput from "../components/MessageInput";

const messagesMock = [
  { id: 1, text: "Cześć! Jak mogę pomóc?", side: "left" },
  { id: 2, text: "Potrzebuję informacji o ogłoszeniach.", side: "right" },
  { id: 3, text: "Jasne, już wyświetlam!", side: "left" },
  { id: 1, text: "Cześć! Jak mogę pomóc?", side: "left" },
  { id: 2, text: "Potrzebuję informacji o ogłoszeniach.", side: "right" },
  { id: 3, text: "Jasne, już wyświetlam!", side: "left" },
  { id: 1, text: "Cześć! Jak mogę pomóc?", side: "left" },
  { id: 2, text: "Potrzebuję informacji o ogłoszeniach.", side: "right" },
  { id: 3, text: "Jasne, już wyświetlam!", side: "left" },
  { id: 1, text: "Cześć! Jak mogę pomóc?", side: "left" },
  { id: 2, text: "Potrzebuję informacji o ogłoszeniach.", side: "right" },
  { id: 3, text: "Jasne, już wyświetlam!", side: "left" },
];

const ChatPage = () => {
  const [messages, setMessages] = React.useState(messagesMock);

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

        <MessageInput onSend={(msg) => console.log("Wysyłam:", msg)} />

        {[...Array(30)].map((_, i) => (
          <Typography key={i}>Element {i + 1}</Typography>
        ))}
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

        {messages.map(msg => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.side === "right" ? "flex-end" : "flex-start"
            }}
          >
            <Paper
              elevation={2}
              sx={{
                padding: "8px 12px",
                maxWidth: "70%",
                backgroundColor: msg.side === "right" ? "#d1e7ff" : "#ffffff",
                borderRadius: 2,
                whiteSpace: "pre-wrap"
              }}
            >
              {msg.text}
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChatPage;

import React from "react";
import { Box, TextField, Button } from "@mui/material";

const MessageInput = ({ onSend }) => {
  const [text, setText] = React.useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend?.(text);
    setText("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
        fontFamily: "Courier New, monospace"
      }}
    >
      <TextField
        label="Wpisz wiadomość"
        multiline
        minRows={3}
        maxRows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="outlined"
        fullWidth
      />

      <Button
        variant="outlined"
        color="primary"
        onClick={handleSend}
        sx={{ alignSelf: "flex-end" }}
      >
        Wyślij
      </Button>
    </Box>
  );
};

export default MessageInput;

import React, { useState } from "react";
import {
  TextField,
  Button,
  TableRow,
  TableCell
} from "@mui/material";

import keycloak from "../keycloak";

export default function ContactAdInlineForm(props) {

  const [content, setContent] = useState("");

  const [successBlink, setSuccessBlink] = useState(false);
  const [errorBlink, setErrorBlink] = useState(false);
  const handleSuccessBlink = () => {
    setSuccessBlink(true);
    setTimeout(() => setSuccessBlink(false), 500);
  };
  const handleErrorBlink = () => {
    setErrorBlink(true);
    setTimeout(() => setErrorBlink(false), 500);
  };
  const handleVisibility = () => {
    setHidden(!hidden);
  }

  const handleSubmit = async () => {

    const msgForm = {
        from: props.userInfo.user.id,
        to: props.ad.user,
        content: content,
    };

    console.log(msgForm);
    console.log(props.ad);

    try {
      const response = await fetch(`http://localhost:3020/messages`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + keycloak.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(msgForm)
    });

    if (!response.ok) {
      handleErrorBlink();
      throw new Error("Błąd podczas zapisywania ogłoszenia");
    }

    //const updated = await response.json();
    handleSuccessBlink();
    if(props.reloadAds) props.reloadAds();

  } catch (error) {
    handleErrorBlink();
    console.error(error);
  }

};

return (

    <TableRow key={`${props.ad.id}-contact`}>
    <TableCell colSpan={5}><TextField
            label="Treść wiadomości"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            /></TableCell>
    <TableCell align="right">
        <Button
        variant={errorBlink || successBlink ? 'contained' : 'outlined'}
        color={errorBlink ? 'error' : 'primary'}
        sx={{ mr: 1 }}
        onClick={handleSubmit}
        >
        Wyślij
        </Button>
    </TableCell>
    </TableRow>

  );

}

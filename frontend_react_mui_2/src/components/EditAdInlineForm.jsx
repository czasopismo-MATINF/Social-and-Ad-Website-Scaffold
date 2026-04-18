import React, { useState } from "react";
import {
  TextField,
  Button,
  TableRow,
  TableCell
} from "@mui/material";

import keycloak from "../keycloak";

export default function EditAdInlineForm(props) {

  const [title, setTitle] = useState(props.ad.title);
  const [content, setContent] = useState(props.ad.content);

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
    
    const adForm = {
        title : title,
        content : content,
        id : props.ad.id,
        category: props.ad.category
    };

    try {
      const response = await fetch(`http://localhost:3020/ads/${adForm.id}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + keycloak.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(adForm)
    });

    if (!response.ok) {
      handleErrorBlink();
      throw new Error("Błąd podczas zapisywania ogłoszenia");
    }

    const updated = await response.json();
    handleSuccessBlink();
    if(props.reloadAds) props.reloadAds();

  } catch (error) {
    handleErrorBlink();
    console.error(error);
  }

};

return (

    <TableRow key={`${props.ad.id}-edit`}>
    <TableCell><TextField
            label="Tytuł"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            multiline
            /></TableCell>
    <TableCell colSpan={3}><TextField
            label="Tytuł"
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
        Zapisz
        </Button>
    </TableCell>
    </TableRow>

  );

}

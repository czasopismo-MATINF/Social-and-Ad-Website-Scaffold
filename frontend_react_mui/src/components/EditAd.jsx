import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";

import keycloak from "../keycloak";

export default function EditAdPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Pobierz ogłoszenie po ID
  useEffect(() => {
    fetch(`http://localhost:3020/ads/${id}`, {
      headers: {
        "Authorization": "Bearer " + keycloak.token
      }
    })
      .then(res => res.json())
      .then(data => {
        setAd(data);
        setLoading(false);
      });
  }, [id]);

const handleSave = async () => {
  try {
    const response = await fetch(`http://localhost:3020/ads/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + keycloak.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ad)
    });

    if (!response.ok) {
      throw new Error("Błąd podczas zapisywania ogłoszenia");
    }

    const updated = await response.json();
    console.log("Zapisano:", updated);

    handleSuccessBlink(); // Twój efekt wizualny

  } catch (error) {
    console.error(error);
    // tu możesz dodać snackbar z błędem
  }
};


  if (loading || !ad) return <Typography>Ładowanie...</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edytuj ogłoszenie
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        
        <TextField
          label="Tytuł"
          value={ad.title}
          onChange={(e) => setAd({ ...ad, title: e.target.value })}
          fullWidth
        />

        <TextField
          label="Treść"
          value={ad.content}
          onChange={(e) => setAd({ ...ad, content: e.target.value })}
          fullWidth
          multiline
          minRows={6}
        />

        <Button
          variant={errorBlink || successBlink ? 'contained' : 'outlined'}
          color={errorBlink ? 'error' : 'primary'}
          onClick={handleSave}
          sx={{ alignSelf: "flex-end" }}
        >
          Zapisz
        </Button>
      </Box>
    </Paper>
  );
}

import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import { useSelector } from 'react-redux'

import keycloak from "../keycloak";

export default function NewAdForm({ reloadAds }) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const categoriesInfo = useSelector(state => state.example.categories);

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

  const handleSubmit = async () => {
    const newAd = { title, content, category };

    try {
      const response = await fetch("http://localhost:3020/ads", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + keycloak.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newAd)
      });

      if (!response.ok) {
        handleErrorBlink();
        console.log(response);
        throw new Error("Nie udało się dodać ogłoszenia");
      }

      const saved = await response.json();
      console.log(saved);
      handleSuccessBlink();

      if (reloadAds) reloadAds();

      setTitle("");
      setContent("");
      setCategory("");

    } catch (error) {
      handleErrorBlink();
      console.error(error);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dodaj nowe ogłoszenie
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        
          <FormControl fullWidth>
          <InputLabel>Kategoria</InputLabel>
          <Select
            value={category}
            label="Kategoria"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoriesInfo?.categories?.categories?.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <TextField
          label="Treść"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          minRows={6}
        />

        <Button
          variant={errorBlink || successBlink ? 'contained' : 'outlined'}
          color={errorBlink ? 'error' : 'primary'}
          onClick={handleSubmit}
          sx={{ alignSelf: "flex-end" }}
        >
          Zapisz
        </Button>
      </Box>
    </Paper>
  );
}

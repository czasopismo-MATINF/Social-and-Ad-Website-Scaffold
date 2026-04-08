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

export default function SerachAdForm({ handleSearchForm, searchParams }) {

  const [keyword, setKeyword] = useState(searchParams.get("keyword"));

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
    handleSuccessBlink();
    //TODO: wysyłać coraz nowe pola formularza jako nowe filtry
    handleSearchForm({
      keyword: keyword
    });
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Szukaj ogłoszeń
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

        <TextField
          label="Słowo kluczowe"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          fullWidth
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

import React, { useState } from "react";
import {
  Paper,
  Typography,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableBody,
  TextField,
  Button
} from "@mui/material";

import { useSelector, useDispatch } from 'react-redux';

import userInfoPageConfig from '../userInfoPageConfig.jsx';

import keycloak from "../keycloak.js";

import * as Reducers from '../store/slice.js'

function toAttributesObject(obj) {
  return {
    attributes: Object.entries(obj).map(([key, value]) => ({
      attributeName: key,
      attributeValue: value
    }))
  };
}

export default function UserInfoEditRawPage(props) {

  const userInfo = useSelector(state => state.main.userInfo);

  const dispatch = useDispatch();

  // --- 1. Inicjalizacja lokalnego stanu formularza ---
  const initialForm = {};
  userInfoPageConfig?.attributes?.forEach(row => {
    const attr = userInfo?.user?.attributes?.find(a => a.attributeName === row.attributeName);
    initialForm[row.attributeName] = attr ? attr.attributeValue : "";
  });

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

  const [form, setForm] = useState(initialForm);

  React.useEffect(() => {
    if (!userInfo) return;

    const initial = {};

    userInfoPageConfig?.attributes?.forEach(row => {
      const attr = userInfo?.user?.attributes?.find(a => a.attributeName === row.attributeName);
      initial[row.attributeName] = attr ? attr.attributeValue : "";
    });

    setForm(initial);
  }, [userInfo]);
    
  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInfo) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3020/users/username/${keycloak.tokenParsed?.preferred_username}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...userInfo,
          attributes: toAttributesObject(form).attributes
        })
      });

      if (!response.ok) {
        handleErrorBlink();
        throw new Error(`Aktualizacja nie powiodła się: ${response.status}`);
      }

      const updatedData = await response.json();
      dispatch(Reducers.userInfoCollected(updatedData));
      handleSuccessBlink();
    
    } catch (error) {
      handleErrorBlink();
      console.error('Błąd zapisu danych użytkownika:', error);
    }
  };

  if (!userInfo) {
    return (
        <p>Brak danych użytkownika do edycji.</p>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid #ddd",
        backgroundColor: "#fafafa",
        maxWidth: 700,
        margin: "0 auto"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Edycja informacji o użytkowniku
      </Typography>

      <form onSubmit={handleSubmit}>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {userInfoPageConfig.attributes.map((row, index) => (
                <TableRow key={index}>
                  {/* Nazwa pola */}
                  <TableCell
                    sx={{
                      width: "40%",
                      fontWeight: 600,
                      color: "#555",
                      borderBottom: "1px solid #e0e0e0"
                    }}
                  >
                    {row.attributeDisplayName} :
                  </TableCell>

                  {/* Pole edycyjne */}
                  <TableCell
                    sx={{
                      width: "60%",
                      textAlign: "right",
                      borderBottom: "1px solid #e0e0e0"
                    }}
                  >
                    {!row.multiline && <TextField
                      size="small"
                      fullWidth
                      value={form[row.attributeName]}
                      onChange={(e) => handleChange(row.attributeName, e.target.value)}
                    />}
                   {row.multiline && <TextField
                      size="small"
                      fullWidth
                      multiline
                      minRows={3}
                      value={form[row.attributeName]}
                      onChange={(e) => handleChange(row.attributeName, e.target.value)}
                    />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Przycisk zapisu */}
        <Button
          type="submit"
          variant={errorBlink || successBlink ? 'contained' : 'outlined'}
          color={errorBlink ? 'error' : 'primary'}
          sx={{ mt: 3, float: "right" }}
        >
          Zapisz
        </Button>
      </form>
    </Paper>
  );
}

import { useState } from 'react'
import './Custom.css'

import { useEffect } from "react";
import keycloak from "./keycloak.js";

import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, keycloakLoggedIn, keycloakLoggedOut, userInfoCollected } from '../store/slice.js'

import { Button, TextField, Box, Stack, Typography } from '@mui/material'

export default function EditUserInfoComponent() {

  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.example.userInfo);
  const [formState, setFormState] = useState({
    attributes: []
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

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    setFormState({
      attributes: Array.isArray(userInfo.attributes) ? userInfo.attributes.map((attr) => ({
            attributeName: attr.attributeName ?? attr.name ?? '',
            attributeValue: attr.attributeValue ?? attr.value ?? ''
          }))
        : []
    });
  }, [userInfo]);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAttributeChange = (index, field) => (event) => {
    setFormState((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, idx) =>
        idx === index ? { ...attr, [field]: event.target.value } : attr
      )
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInfo) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3020/users/${keycloak.tokenParsed?.preferred_username}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...userInfo,
          attributes: formState.attributes
        })
      });

      if (!response.ok) {
        handleErrorBlink();
        throw new Error(`Aktualizacja nie powiodła się: ${response.status}`);
      }

      const updatedData = await response.json();
      dispatch(userInfoCollected(updatedData));
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
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, mx: 'auto', p: 2 }}>
        <Typography variant="h5" mb={2}>
          Edycja danych użytkownika
        </Typography>
        <Stack spacing={2}>
          {formState.attributes.length === 0 ? (
            <Typography>Brak danych użytkownika do edycji.</Typography>
          ) : (
            formState.attributes.map((attr, index) => (
              <Box
                key={index}
                sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}
              >
                <TextField
                  label="Atrybut"
                  value={attr.attributeName}
                  fullWidth
                  size="small"
                  disabled
                />
                <TextField
                  label="Wartość"
                  value={attr.attributeValue}
                  onChange={handleAttributeChange(index, 'attributeValue')}
                  fullWidth
                  size="small"
                />
              </Box>
            ))
          )}
          <Button
            type="submit"
            variant={errorBlink || successBlink ? 'contained' : 'outlined'}
            color={errorBlink ? 'error' : 'primary'}
            size="large"
            sx={{ transition: 'background-color 150ms ease, color 150ms ease' }}
          >
            Zapisz zmiany
          </Button>
        </Stack>
      </Box>
    </>
  );

}
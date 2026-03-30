import { useState } from 'react'
import './Custom.css'

import { useEffect } from "react";
import keycloak from "./keycloak.js";

import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, keycloakLoggedIn, keycloakLoggedOut, userInfoCollected } from '../store/slice.js'

import { MenuItem, OutlinedInput, Select, Button, TextField, Box, Stack, Typography } from '@mui/material'

import userEditPageConfig from './userEditPageConfig.jsx'

import { useTheme } from '@mui/material/styles';

function MultipleSelect(props) {
 
  const { attrConfig, attr, handleAttributeChange } = props;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    let newValue = typeof value === "string" ? JSON.stringify(value.split(",")) : value;
    handleAttributeChange(attr.attributeName, newValue);
  };

  return (
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={Array.isArray(attr.attributeValue) ? 
            attr.attributeValue : 
            ((attr.attributeValue !== undefined && attr.attributeValue.length > 0) ? JSON.parse(attr.attributeValue) : [])}
          onChange={handleChange}
          input={<OutlinedInput label={attrConfig.attributeDisplayName} />}
          MenuProps={MenuProps}
        >
          {attrConfig.options.map((opt) => (
            <MenuItem
              key={opt}
              value={opt}
              style={{ fontWeight: theme.typography.fontWeightRegular }}
            >
              {opt}
            </MenuItem>
          ))}
        </Select>
  );
}

function DefaultEditComponent(props) {
  const { attrConfig, attr, handleAttributeChange } = props;
  return  <TextField
    label={attrConfig.attributeDisplayName}
    value={attr.attributeValue}
    onChange={(e) => handleAttributeChange(attr.attributeName, e.target.value)}
    fullWidth
    size="small"
  />
}

function getDisplayComponent(attrConfig, attr, handleAttributeChange) {
  if (Object.prototype.hasOwnProperty.call(attrConfig, 'multichoice')) {
    return <MultipleSelect attrConfig={attrConfig} attr={attr} handleAttributeChange={handleAttributeChange} />
  }
  return <DefaultEditComponent attrConfig={attrConfig} attr={attr} handleAttributeChange={handleAttributeChange} />
}

export default function EditUserInfoComponentFieldSettings() {
  
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.example.userInfo);

  const [formState, setFormState] = useState({
    attributes : userEditPageConfig.attributes.map((attrConfig) => ({
          attributeName: attrConfig.attributeName,
          attributeValue: userInfo && userInfo.attributes && userInfo.attributes?.find((a) => a.attributeName === attrConfig.attributeName)?.attributeValue || ''
        }))
  });

  useEffect(() => {
    if (!userInfo || !userInfo.attributes || !Array.isArray(userInfo.attributes)) {
      return;
    }
    setFormState({
      attributes : userEditPageConfig.attributes.map((attrConfig) => ({
            attributeName: attrConfig.attributeName,
            attributeValue: userInfo && userInfo.attributes && userInfo.attributes?.find((a) => a.attributeName === attrConfig.attributeName)?.attributeValue || ''
          }))
    });
  }, [userInfo]);

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

  const handleAttributeChange = (attrName, attrValue) => {
    setFormState(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr =>
        attr.attributeName === attrName
          ? { ...attr, attributeValue: attrValue }
          : attr
      )
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInfo) {
      return;
    }
    for(let a of formState.attributes) {
      if(Array.isArray(a.attributeValue)) {
        a.attributeValue = JSON.stringify(a.attributeValue);
      }
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

  if(userInfo === null || userInfo.attributes === undefined || !Array.isArray(userInfo.attributes) || userInfo.attributes.length === 0) {
    return <div>Brak danych użytkownika do edycji.</div>
  }

  return (
        <>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, mx: 'auto', p: 2 }}>
        <Typography variant="h5" mb={2}>
          Edycja danych użytkownika
        </Typography>
        <Stack spacing={2}>
            {userEditPageConfig.attributes.map((attrConfig, index) => (
              <Box
                key={index}
                sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}
              >
              {getDisplayComponent(attrConfig, formState.attributes?.find(a => a.attributeName === attrConfig.attributeName) ?? {}, handleAttributeChange)}
              </Box>
            ))}
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

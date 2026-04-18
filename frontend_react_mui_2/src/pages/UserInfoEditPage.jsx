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
  Button,
  Select,
  MenuItem,
  Box,
  Chip
} from "@mui/material";

import { useSelector, useDispatch } from 'react-redux';
import userInfoPageConfig from '../userInfoPageConfig.jsx';

import keycloak from "../keycloak.js";

import * as Reducers from '../store/slice.js'

function toAttributesObject(obj, userInfoPageConfig) {
  return {
    attributes: Object.entries(obj).map(([key, value]) => {
      const config = userInfoPageConfig.attributes.find(a => a.attributeName === key);
      return {
        attributeName: key,
        attributeValue: (config?.multichoice || config?.array)
          ? JSON.stringify(value)
          : value
      };
    })
  };
}

function WordsInput({ value, onChange, placeholder = "Dodaj słowo..." }) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed.length > 0 && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      setInput("");
    }
  };

  const handleDelete = (word) => {
    onChange(value.filter(w => w !== word));
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {value.map((word, index) => (
        <Chip
          key={index}
          label={word}
          onDelete={() => handleDelete(word)}
        />
      ))}

      <TextField
        variant="standard"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        sx={{ minWidth: 120 }}
      />
    </Box>
  );
}

export default function UserInfoEditPage(props) {

  const userInfo = useSelector(state => state.main.userInfo);

  const dispatch = useDispatch();

  // --- 1. Inicjalizacja lokalnego stanu formularza ---
  const initialForm = {};
  userInfoPageConfig.attributes.forEach(row => {
    const attr = userInfo?.user?.attributes.find(a => a.attributeName === row.attributeName);
    if(row.multichoice || row.array) {
      initialForm[row.attributeName] = [];
      try {
        for(let o of JSON.parse(attr?.attributeValue)) {
          initialForm[row.attributeName].push(o);
        }
      } catch(e) {
        console.log(e);
        initialForm[row.attributeName] = [];
      }
    } else {
      initialForm[row.attributeName] = attr ? attr.attributeValue : "";
    }
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

    userInfoPageConfig.attributes.forEach(row => {
      const attr = userInfo.user.attributes.find(a => a.attributeName === row.attributeName);

      if (row.multichoice || row.array) {
        try {
          initial[row.attributeName] = JSON.parse(attr?.attributeValue || "[]");
        } catch {
          initial[row.attributeName] = [];
        }
      } else {
        initial[row.attributeName] = attr ? attr.attributeValue : "";
      }
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
    console.log(toAttributesObject(form, userInfoPageConfig));
    try {
      const response = await fetch(`http://localhost:3020/users/username/${keycloak.tokenParsed?.preferred_username}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...userInfo,
          attributes: toAttributesObject(form, userInfoPageConfig).attributes
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
                    {!row.multiline && !row.multichoice && !row.array && <TextField
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

                    {row.array && <WordsInput value={form[row.attributeName]} onChange={(v) => handleChange(row.attributeName, v)}/> }
                    
                    {row.multichoice &&
                      <Select
                        displayEmpty
                        multiple
                        value={form[row.attributeName]}
                        onChange={(e) => handleChange(row.attributeName, e.target.value)}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                              return <span style={{ color: "#888" }}>Wybierz opcję</span>;
                            }
                            return (<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {
                              selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}}
                      >
                        {row.options.map((opt, index) => (
                          <MenuItem key={index} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>}

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

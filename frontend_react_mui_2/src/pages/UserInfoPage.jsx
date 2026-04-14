import React from "react";
import { Chip, Button, Box, Grid, Paper, Typography, TableRow, TableCell, TableContainer, Table, TableBody } from "@mui/material";

import { useSelector, useDispatch } from 'react-redux'

import { Link } from "react-router-dom";

import userInfoPageConfig from '../userInfoPageConfig'

export default function UserInfoPage(props) {
  
   const userInfo = useSelector(state => state.main.userInfo);
  
   if(!userInfo) return <><div>Ładowanie...</div></>

   const getAttributeValue = (row) => {
     return userInfo.user.attributes.find(a => a.attributeName === row.attributeName).attributeValue;
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
        Informacje o użytkowniku
      </Typography>

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

                {/* Wartość — wyrównana do prawej */}
                {!row.multichoice && !row.array &&
                <TableCell
                  sx={{
                    width: "60%",
                    textAlign: "right",
                    color: "#333",
                    borderBottom: "1px solid #e0e0e0"
                  }}
                >
                  {getAttributeValue(row)}
                </TableCell>
                }

                {(row.multichoice || row.array) &&
                      <TableCell
                        sx={{
                          width: "60%",
                          textAlign: "right",
                          color: "#333",
                          borderBottom: "1px solid #e0e0e0"
                        }}
                      >
                      {JSON.parse(getAttributeValue(row)).map((word, index) => (
                        <Chip
                          key={index}
                          label={word}
                        />
                      ))}
                    </TableCell>
                }

              </TableRow>
            ))}
              <TableRow key={`edit`}>
                {/* Nazwa pola */}
                <TableCell
                  sx={{
                    width: "40%",
                    fontWeight: 600,
                    color: "#555",
                    borderBottom: "1px solid #e0e0e0"
                  }}
                >
                  Edytuj :
                </TableCell>

                {/* Wartość — wyrównana do prawej */}
                <TableCell
                  sx={{
                    width: "60%",
                    textAlign: "right",
                    color: "#333",
                    borderBottom: "1px solid #e0e0e0"
                  }}
                >
                  <Link to="/userinfoedit"><Button>Edytuj</Button></Link>
                  <Link to="/userinfoeditraw"><Button>Edytuj surowe</Button></Link>
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

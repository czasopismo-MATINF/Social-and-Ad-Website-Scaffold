import { Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Stack, Typography, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import userInfoPageConfig from './userInfoPageConfig.jsx'

function MultiLineDialog(props) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = (event, reason) => {
    // jeśli chcesz zablokować zamykanie kliknięciem poza dialog
    // if (reason === 'backdropClick') return
    setOpen(false)
  }
  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        {props.attr && props.attr.attributeValue ? props.attr.attributeValue.substr(0, 20) + (props.attr.attributeValue.length > 20 ? '...' : '') : 'Brak danych'}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props.attrConfig.attributeDisplayName}</DialogTitle>
        <DialogContent>
          <Typography>
            {props.attr && props.attr.attributeValue ? props.attr.attributeValue : 'Brak danych'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function getDisplayComponent(attrConfig, attr) {
  if (Object.prototype.hasOwnProperty.call(attrConfig, 'array')) {
    return <>array</>
  }
  if (Object.prototype.hasOwnProperty.call(attrConfig, 'multichoice')) {
    return <>multichoice</>
  }
  if (Object.prototype.hasOwnProperty.call(attrConfig, 'multiline')) {
    return <MultiLineDialog attrConfig={attrConfig} attr={attr} />
  }
  return <Typography variant="body1">
      {attr && attr.attributeValue ? attr.attributeValue : 'Brak danych'}
  </Typography>
}

export default function UserInfoComponentFieldSettings({ userInfo }) {
    return <Stack spacing={2}>
          {userInfo == null || userInfo.attributes == null || userInfo.attributes.length === 0 ? (
            <Typography>Brak danych użytkownika do wyświetlenia.</Typography>
          ) : (
            userInfoPageConfig.attributes.map((attrConfig, index) => (
              <Box
                key={index}
                sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}
              >
                <Typography variant="body1">
                  {attrConfig.attributeDisplayName}
                </Typography>
                {
                  getDisplayComponent(attrConfig, userInfo.attributes.find(a => a.attributeName === attrConfig.attributeName))
                }
              </Box>
            ))
          )}
        </Stack>
}
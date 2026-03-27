import { Button, Box, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function UserInfoComponent({ userInfo }) {
    return <Stack spacing={2}>
          {userInfo == null ||userInfo.attributes.length === 0 ? (
            <Typography>Brak danych użytkownika do wyświetlenia.</Typography>
          ) : (
            userInfo.attributes.map((attr, index) => (
              <Box
                key={index}
                sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}
              >
                <Typography variant="body1">
                  {attr.attributeName}
                </Typography>
                <Typography variant="body1">
                  {attr.attributeValue}
                </Typography>
              </Box>
            ))
          )}
        </Stack>
}
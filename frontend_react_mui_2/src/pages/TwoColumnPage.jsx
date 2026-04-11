import { Box, Typography, TextField } from "@mui/material";

const TwoColumnPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        fontFamily: "Courier New, monospace",
      }}
    >
      {/* Lewa kolumna */}
      <Box
        sx={{
          width: "20%",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          minHeight: 0,
          p: 2,
        }}
      >
        <Typography variant="h6">Lewa kolumna</Typography>

        <TextField
          label="Wpisz tekst"
          multiline
          minRows={3}
          fullWidth
          sx={{ mb: 2 }}
        />

        {[...Array(30)].map((_, i) => (
          <Typography key={i}>Element {i + 1}</Typography>
        ))}
      </Box>

      {/* Prawa kolumna */}
      <Box
        sx={{
          width: "80%",
          overflowY: "auto",
          minHeight: 0,
          p: 2,
        }}
      >
        <Typography variant="h6">Prawa kolumna</Typography>

        {[...Array(100)].map((_, i) => (
          <Typography key={i}>Wpis {i + 1}</Typography>
        ))}
      </Box>
    </Box>
  );
};

export default TwoColumnPage;

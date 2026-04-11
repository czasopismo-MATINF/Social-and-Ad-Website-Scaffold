import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 2,
        borderTop: "1px solid #ccc",
        backgroundColor: "#f5f5f5",
        fontFamily: "Courier New, monospace",
      }}
    >
      <Typography variant="body2">
        © 2026 – Twoja aplikacja mikroserwisowa
      </Typography>
    </Box>
  );
};

export default Footer;

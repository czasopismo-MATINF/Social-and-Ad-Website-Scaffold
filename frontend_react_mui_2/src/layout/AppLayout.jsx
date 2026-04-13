import { Box } from "@mui/material";
import TopMenu from "./TopMenu";
import Footer from "./Footer";

const AppLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        fontFamily: "Courier New, monospace",
      }}
    >
      {/* Menu */}
      <TopMenu />

      {/* Przestrzeń na podstrony */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          padding: 2,
          backgroundColor: "#fafafa",
        }}
      >
        {children}
      </Box>

      {/* Stopka */}
      <Footer />
    </Box>
  );
};

export default AppLayout;

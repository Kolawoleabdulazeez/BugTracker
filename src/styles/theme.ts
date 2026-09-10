// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ED6214",
      light: "#F4934C",
      dark: "#AA2F0A",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#239A3C",
    },
    error: {
      main: "#B51629",
    },
  },
});

export default theme;
// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#003399",
      light: "#3355cc",
      dark: "#001a66",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0DDE65",
    },
  },
});

export default theme;

import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const Light = createTheme({
  palette: {
    primary: {
      main: '#5C16F4',
      dark: '#3402a1',
      light: '#7c42fc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#272949',
      dark: '#0f112e',
      light: '#333669',
      contrastText: '#ffffff',
    },

    background: {
      paper: '#f9f9f9',
      default: '#FFFFFF',
    },
    error: {
      main: red.A400,
    },
  },
});

export default Light;

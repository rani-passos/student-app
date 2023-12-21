import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const Light = createTheme({
  palette: {
    primary: {
      main: '#79187F',
      dark: '#48034d',
      light: '#941f9c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#17335C',
      dark: '#011636',
      light: '#0242a1',
      contrastText: '#ffffff',
    },
    info: {
      main: '#fff',
      dark: '#fff',
      light: '#fff',
      contrastText: '#000',
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

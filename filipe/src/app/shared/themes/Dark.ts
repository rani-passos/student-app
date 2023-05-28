import { createTheme } from '@mui/material/styles';
import { purple, deepPurple, blue, lightBlue, red } from '@mui/material/colors';

const DraculaColors = {
  foreground: '#f8f8f2',
  comment: '#6272a4',
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  red: '#ff5555',
  yellow: '#f1fa8c',
};

// Create a theme instance.
const Dark = createTheme({
  palette: {
    primary: {
      main: '#f6a304',
      dark: DraculaColors.purple,
      light: '#f6a304',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f6a304',
      dark: '#f6a304',
      light: '#f6a304',
      contrastText: '#ffffff',
    },
    background: {
      paper: '#44475a',
      default: '#282a36',
    },
    error: {
      main: '#ff5555',
    },
  },
});
export default Dark;

// Palette	HEX	Color Picker
// Background	#282a36
// Current Line	#44475a
// Foreground	#f8f8f2
// Comment	#6272a4
// Cyan	#8be9fd
// Green	#50fa7b
// Orange	#ffb86c
// Pink	#ff79c6
// Purple	#bd93f9
// Red	#ff5555
// Yellow	#f1fa8c

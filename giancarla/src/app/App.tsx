import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { DrawerProvider, AuthProvider } from './shared/contexts';
import { Rotas } from './routes';
import { ThemeProvider } from '@mui/material';
import Light from './shared/themes/Light';

export const App = () => {
  return (
    <Router>
      <SnackbarProvider>
        <AuthProvider>
          <ThemeProvider theme={Light}>
            <DrawerProvider>
              <Rotas />
            </DrawerProvider>
          </ThemeProvider>
        </AuthProvider>
      </SnackbarProvider>
    </Router>
  );
};

export default App;

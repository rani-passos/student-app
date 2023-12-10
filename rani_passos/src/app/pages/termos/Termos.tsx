import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Footer, TopMenu } from '../../shared/components';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../shared/contexts';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Alert,
  AlertTitle,
  LinearProgress,
} from '@mui/material';

import { ITerms, TermsService } from '../../shared/services/terms/TermsService';

export const Termos = () => {
  const { isAuth } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(true);
  const [termCheckedUser, setTermCheckedUser] = React.useState(true);

  const [termUse, setTermUse] = React.useState<ITerms>({
    content: '',
  });

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  const handleCheckedTerm = () => {
    TermsService.create().then((result: any) => {
      setIsLoading(false);
      if (result instanceof Error) {
        console.error('Terms' + result.message);
      } else {
        setTermCheckedUser(true);
      }
    });
  };

  React.useEffect(() => {
    TermsService.lastTerm().then((result: any) => {
      setIsLoading(false);
      if (result instanceof Error) {
        console.error('Terms' + result.message);
      } else {
        setTermUse(result);
      }
    });
  }, []);

  React.useEffect(() => {
    TermsService.checkedUser().then((result: any) => {
      if (result instanceof Error) {
        console.error('Terms' + result.message);
      } else {
        setTermCheckedUser(result.checked);
      }
    });
  }, []);

  function renderLoading() {
    return (
      !!isLoading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )
    );
  }

  function renderTermUse() {
    return <Box dangerouslySetInnerHTML={{ __html: termUse.content }}></Box>;
  }

  function renderNoApproveTerm() {
    return (
      !termCheckedUser && (
        <Alert severity="warning" sx={{ width: '100%' }}>
          <AlertTitle>Atenção</AlertTitle>
          Para prosseguir e utilizar o sistema, por favor leia e aceite os
          termos de uso.
        </Alert>
      )
    );
  }

  function renderApproveTerm() {
    return (
      !termCheckedUser && (
        <Box sx={{ width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckedTerm}
          >
            Li e concordo com os termos de uso
          </Button>
        </Box>
      )
    );
  }

  return (
    <Box>
      <CssBaseline />
      <TopMenu />
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          background: 'url(/assets/images/img-breadcrumb.png) top center',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          padding: '48px 0',
          marginTop: { xs: '70px', sm: '70px', md: '70px' },
        }}
      >
        <Typography variant="h5" color="white" textAlign="center">
          TERMO DE USO
        </Typography>
      </Box>
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 1,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 4,
          }}
        >
          {renderLoading()}
          {renderNoApproveTerm()}
          {renderTermUse()}
          {renderApproveTerm()}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Termos;

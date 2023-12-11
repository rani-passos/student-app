import { Box, CssBaseline, Typography } from '@mui/material';
import * as React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Footer, TopMenu } from '../../shared/components';
import { AuthProvider, useAuthContext } from '../../shared/contexts';

import Cursos from '../cursos/Cursos';
const pages = [
  { name: 'Cursos', url: '/' },
  { name: 'Pedidos', url: '/pedidos' },
  { name: 'Meus Dados', url: '/minha-conta' },
  { name: 'ChatRAV', url: '/chat-rav' },
];

export const Painel = () => {
  const { isAuth } = useAuthContext();
  const [openDialog, setOpenDialog] = React.useState(true);

  const [actualPage, setActualPage] = React.useState('');
  const location = useLocation();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function getActualPage() {
    const pathname = pages.filter((e) => e.url === location.pathname);
    const actualPage = pages.filter((page) => page.url === pathname[0].url);
    setActualPage(actualPage[0].name.toUpperCase());
  }

  React.useEffect(() => {
    getActualPage();
  }, [actualPage]);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <CssBaseline />
      <TopMenu />
      <Box
        sx={{
          background: 'url(/assets/images/img-breadcrumb.png) top center',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          padding: { xs: '25px 0', sm: '48px 0', md: '48px 0' },
          marginTop: '70px',
        }}
      >
        <Typography variant="h5" color="white" textAlign="center">
          {actualPage}
        </Typography>
      </Box>
      <Cursos />
      <Footer />
    </div>
  );
};

export default Painel;

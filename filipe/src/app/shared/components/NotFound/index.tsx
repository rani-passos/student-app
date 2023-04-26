import { Button, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { TopMenu } from '../TopMenu';

export const NotFound = ()  => {
  const navigate = useNavigate();
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh', padding: '36px' }}
      >
        <Typography variant='h6' >Ops! Não encontramos seu endereço.</Typography>
        <Button sx={{ margin: 2 }} size='large' variant='contained' color='secondary' onClick={() => navigate('/')}>Voltar</Button>
        <Box style={{ width: '30%' }} >
          <img src='/assets/images/NotFound.svg' width="100%" height="auto"  />
        </Box>
      </Grid>
    </>
  );
};

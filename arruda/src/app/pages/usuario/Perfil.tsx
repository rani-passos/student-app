import * as React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import LockOutlinedIcon from '@mui/icons-material/Person';
import { IUserData, UserService } from '../../shared/services/user/UserService';
import {
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Container,
  Typography,
  Box,
  Button,
  Avatar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { Link } from 'react-router-dom';
import { Footer, TopMenu } from '../../shared/components';
import { redirect } from 'react-router-dom';
import { useAuthContext } from '../../shared/contexts';


export const Perfil = () => {
  const { isAuth } = useAuthContext();

  const [error, setError] = React.useState(false);
  const [userData, setUserData] = React.useState<IUserData>();
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();


  React.useEffect(() => {
    setIsLoading(true);
    UserService.getAll().then((result: IUserData) => {
      if (result instanceof Error) {
        setError(true);
      } else {
        setUserData(result);
      }
    });
    setIsLoading(false);
  }, []);

  if(!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <TopMenu />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={0} style={{ margin: '32px 0px' }}>
            <Card>
              <CardHeader
                // subheader="Estas informações podem ser editadas"
                title={
                  <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                      Minha Conta
                    </Typography>
                  </Box>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {userData?.name}

                  </Grid>
                  <Grid item xs={12}>
                    {userData?.cpf}
                  </Grid>
                  <Grid item xs={12}>
                    {userData?.email}
                  </Grid>
                  <Grid item xs={12}>
                    {userData?.phone}
                  </Grid>

                  <Grid item xs={12}>
                    <Button component={Link} to="/esqueci" variant="contained" >
                        Alterar Senha?
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: 2,
                }}
              >
                <Button color="secondary" variant="contained" startIcon={<SaveIcon />}>
                  Salvar
                </Button>
              </Box> */}
            </Card>
          </Paper>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Perfil;

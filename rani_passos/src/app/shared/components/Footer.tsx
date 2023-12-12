import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import { Divider } from '@mui/material';
import logo from 'rani_passos/public/assets/images/logo.svg';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <>
      <Divider />
      <Box style={{ backgroundColor: '#FFF' }}>
        <Container maxWidth="lg">
          <Box
            py={4}
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box sx={{ margin: '0px 32px' }}>
              <Box
                component="img"
                src={logo}
                sx={{
                  height: 'auto',
                  width: 200,
                  display: { xs: 'none', md: 'flex' },
                  color: 'inherit',
                  mb: 2,
                }}
              />
              <Typography variant="body2" onClick={() => navigate('/chat-rav')}>
                Rani Passos | Todos os direitos reservados | Chat
              </Typography>
            </Box>
            <Box component="div" sx={{ margin: '0px 32px' }}>
              <Typography
                color="textSecondary"
                component="p"
                variant="h5"
                gutterBottom={false}
              >
                Informática
                <br />
                para concursos
              </Typography>
              <p>A estratégia que faltava para você ser aprovado!</p>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

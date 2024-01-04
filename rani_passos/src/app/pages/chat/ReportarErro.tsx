import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Environment } from '../../shared/environment';
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
  Alert,
  AlertTitle,
  LinearProgress,
  CircularProgress,
  Link,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

import imageRavi from 'rani_passos/public/assets/images/chat/ravi.jpeg';
import imageAluno from 'rani_passos/public/assets/images/chat/aluno.jpeg';

import {
  IChats,
  IInformations,
  ITips,
  ChatsService,
} from '../../shared/services/chats/ChatsService';
import { CoursesService } from '../../shared/services/courses/CoursesService';
import { verify } from 'crypto';

export const ReportarErro = () => {
  const [title, setTitle] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setSuccess(false);
    const data = {
      error_chat_gpt_message: {
        title: title,
        content: message,
      },
    };

    console.log('handleSubmit', data);
    ChatsService.reportError(data)
      .then((res) => {
        if (res instanceof Error) {
          setError(true);
          console.log('res instanceof Error', res);
        } else {
          setTitle('');
          setMessage('');
          setSuccess(true);
        }
      })
      .catch(function (error) {
        console.error(error.response.data.messages);
      });
  };

  function renderSuccessMessage() {
    return (
      <>
        {success ? (
          <Alert severity="success" sx={{ marginBottom: 3, width: '100%' }}>
            <AlertTitle>
              Sua atenção aos detalhes faz uma grande diferença para nós.
              Obrigado pelo seu reporte, vamos trabalhar para corrigir o erro e
              melhorar sua experiência com o RAV-I.
            </AlertTitle>
          </Alert>
        ) : null}
      </>
    );
  }

  function verifyDisabledButton() {
    const countTitle = title.length;
    const countMessage = message.length;

    if (countTitle > 20 && countMessage >= 100) {
      return false;
    }

    return true;
  }

  function renderFormError() {
    return (
      <Box
        onSubmit={handleSubmit}
        component="form"
        noValidate
        sx={{
          margin: 2,
          background: '#f9f9f9',
          padding: '12px',
        }}
      >
        <Box
          sx={{
            mt: 1,
            mb: 2,
          }}
        >
          <Typography>
            Parece que você encontrou algo que não está correto. Isso é ótimo!
            Com a sua ajuda, podemos tornar nossa plataforma ainda melhor.
          </Typography>
        </Box>

        <TextField
          value={title}
          fullWidth
          margin="normal"
          label="Titulo"
          name="title"
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          helperText="Digite pelo menos 20 caracteres."
        />

        <TextField
          fullWidth
          multiline
          margin="normal"
          rows={10}
          label="Mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          helperText="Digite pelo menos 100 caracteres."
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={verifyDisabledButton()}
          sx={{ mt: 3, mb: 1 }}
        >
          Enviar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <CssBaseline />
      <TopMenu />
      <Box
        sx={{
          background: 'url(/assets/images/chat/RAV-I.png) top center',
          backgroundSize: 'cover',
          padding: '55px 0',
          marginTop: { xs: '70px', sm: '70px', md: '70px' },
          borderBottom: '2px solid #fff',
        }}
      ></Box>

      <Box
        sx={{
          background: 'url(/assets/images/chat/RAV-I-Fundo.png) top center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <Container component="main" maxWidth="md">
          <Box sx={{ marginBottom: 8, padding: '4px 0px' }}>
            {renderFormError()}
            {renderSuccessMessage()}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default ReportarErro;

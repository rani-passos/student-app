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
  Alert,
  AlertTitle,
  LinearProgress,
} from '@mui/material';

import { IChats, ChatsService } from '../../shared/services/chats/ChatsService';
import { IUserData, UserService } from '../../shared/services/user/UserService';

export const Chat = () => {
  const { isAuth } = useAuthContext();

  const [chatMessages, setChatMessages] = React.useState<IChats[]>([]);
  const [userData, setUserData] = React.useState<IUserData>({
    id: 0,
    company_id: 0,
    name: '',
    birth_date: null,
    cpf: '',
    phone: '',
    status: '',
    email: '',
    created_at: '',
    updated_at: '',
    authentication_token: '',
    use_chat: false,
  });
  const [newMessage, setNewMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    const messagesContainer = messagesEndRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage) return;
    setIsLoadingMessages(true);

    const data = { question: newMessage, answer: '' };
    setNewMessage('');
    ChatsService.create(data).then((result: any) => {
      setIsLoadingMessages(false);
      if (result instanceof Error) {
        console.error('Chats' + result.message);
      } else {
        setChatMessages(result);
      }
    });
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  React.useEffect(() => {
    ChatsService.getAll().then((result: any) => {
      setIsLoading(false);
      if (result instanceof Error) {
        console.error('Chats' + result.message);
      } else {
        setChatMessages(result);
      }
    });
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    UserService.getAll().then((result: IUserData) => {
      if (result instanceof Error) {
        console.error('User' + result.message);
      } else {
        setUserData(result);
      }
    });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoadingMessages]);

  function renderLoading() {
    return (
      !!isLoading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )
    );
  }

  function renderInformativo() {
    return (
      <>
        {!isLoading && !userData.use_chat ? (
          <Alert severity="warning" sx={{ marginBottom: 3, width: '100%' }}>
            <AlertTitle>Aguardem</AlertTitle>
            Em breve, teremos novidades empolgantes!{' '}
          </Alert>
        ) : null}
      </>
    );
  }

  function renderChat() {
    return (
      <Box sx={{ width: '100%', margin: '0 auto' }}>
        <List
          sx={{
            height: 300,
            overflow: 'auto',
            bgcolor: 'background.paper',
          }}
          ref={messagesEndRef}
        >
          {chatMessages.length == 0 && (
            <ListItem>
              <ListItemText secondary="Como posso ajudá-lo hoje?" />
            </ListItem>
          )}

          {chatMessages.map((message, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={message.question} />
              </ListItem>

              <ListItem>
                <ListItemText secondary={message.answer} />
              </ListItem>
            </React.Fragment>
          ))}

          {isLoadingMessages && (
            <Box sx={{ width: '100%', padding: 2 }}>
              <LinearProgress />
            </Box>
          )}
        </List>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <TextField
            fullWidth
            label="Mensagem ChatRAV..."
            value={newMessage}
            disabled={!userData.use_chat}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Box>
      </Box>
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
          Chat - RAV
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
          {renderInformativo()}
          {renderChat()}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Chat;

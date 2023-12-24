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

export const Chat = () => {
  const { isAuth } = useAuthContext();

  const [chatMessages, setChatMessages] = React.useState<IChats[]>([]);
  const [chatInformations, setChatInformations] = React.useState<
    IInformations[]
  >([]);
  const [chatTips, setChatTips] = React.useState<ITips[]>([]);
  const [tip, setTip] = React.useState<ITips | null>(null);
  const [accessChatRav, setAccessChatRav] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');
  const [dailyQuota, setDailyQuota] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [lastMessage, setLastMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLUListElement>(null);

  const userId = () => {
    const userData = sessionStorage.getItem('USER_DATA');
    if (userData) return JSON.parse(userData).id;

    return null;
  };

  function connectWebSocket() {
    const ws = new WebSocket(`wss://${Environment.WS}/cable`);

    ws.onopen = () => {
      console.log('Conectado ao servidor websoket');

      ws.send(
        JSON.stringify({
          command: 'subscribe',
          identifier: JSON.stringify({
            channel: 'ChatChannel',
          }),
        })
      );
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'ping') return;
      if (data.type === 'welcome') return;
      if (data.type === 'confirm_subscription') return;

      if (data.message.id == userId()) {
        console.log('data.message.messages :>> ', data.message.messages);
        setIsLoadingMessages(false);
        setLastMessage('');
        setTip(null);
        setChatMessages(data.message.messages);
      }
    };

    ws.onerror = (error) => {
      console.error('Erro na conexão WebSocket:', error);
      // Trate aqui qualquer ação adicional em caso de erro
    };

    ws.onclose = () => {
      console.log('Conexão WebSocket fechada. Tentando reconectar...');
      setTimeout(connectWebSocket, 3000); // Tenta reconectar após 3 segundos
    };
  }

  const scrollToBottom = () => {
    const messagesContainer = messagesEndRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage) return;
    setLastMessage(newMessage);
    setIsLoadingMessages(true);
    selectNewTip();

    const data = { question: newMessage, answer: '' };
    setNewMessage('');
    ChatsService.create(data).then((result: any) => {
      if (result instanceof Error) {
        console.error('Chats' + result.message);
      }
    });
  };

  // const handleKeyDown = (event: any) => {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     handleSendMessage();
  //   }
  // };

  function selectNewTip() {
    newTip();
    const intervalo = setInterval(newTip, 10000);
    return () => clearInterval(intervalo);
  }

  function newTip() {
    const indiceAleatorio = Math.floor(Math.random() * chatTips.length);
    setTip(chatTips[indiceAleatorio]);
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  function rowsTextField() {
    const charsPerLine = window.innerWidth < 768 ? 37 : 103;

    const lines = newMessage.split('\n');
    const countEnterLines = lines.length;
    const countLines = Math.floor(newMessage.length / charsPerLine);
    const totalCount = countEnterLines + countLines;

    if (totalCount >= 6) return 6;
    return totalCount;
  }

  React.useEffect(() => {
    ChatsService.dailyQuota().then((result: any) => {
      setIsLoading(false);
      if (result instanceof Error) {
        console.error('Daily Quota' + result.message);
      } else {
        setDailyQuota(result.quota);
      }
    });
  }, [chatMessages]);

  React.useEffect(() => {
    ChatsService.getAll().then((result: any) => {
      setIsLoading(false);
      if (result instanceof Error) {
        console.error('Chats' + result.message);
      } else {
        setIsLoadingMessages(false);
        setChatMessages(result);
      }
    });
  }, []);

  React.useEffect(() => {
    ChatsService.getInformations().then((result: any) => {
      if (result instanceof Error) {
        console.error('Informations' + result.message);
      } else {
        setChatInformations(result);
      }
    });
  }, []);

  React.useEffect(() => {
    ChatsService.getTips().then((result: any) => {
      if (result instanceof Error) {
        console.error('Informations' + result.message);
      } else {
        setChatTips(result);
      }
    });
  }, []);

  React.useEffect(() => {
    connectWebSocket();
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    CoursesService.accessChatRav().then((result: any) => {
      if (result instanceof Error) {
        console.error('User' + result.message);
      } else {
        setAccessChatRav(result.access_course);
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

  function renderDailyQuota() {
    return (
      <>
        {!isLoading && dailyQuota > 0 ? (
          <Alert severity="warning" sx={{ marginBottom: 3, width: '100%' }}>
            <AlertTitle>Quota do Dia: {dailyQuota} mensagem</AlertTitle>
          </Alert>
        ) : null}
      </>
    );
  }

  function renderAction() {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px',
          }}
        >
          <Link
            href={'https://www.youtube.com/watch?v=PeSKW2BlLxc'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              color="info"
              sx={{ margin: '16px 0px' }}
              variant="contained"
            >
              Como Usar?
            </Button>
          </Link>
          <Button
            sx={{ margin: '16px 0px' }}
            variant="contained"
            color="info"
            onClick={() => setOpenDialog(true)}
          >
            Informações Importantes
          </Button>
        </Box>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle id="alert-dialog-title">
            Informações Importantes
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <ul>
                {chatInformations.map((information, index) => (
                  <li key={index}>{information.content}</li>
                ))}
              </ul>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} autoFocus>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function renderInformativo() {
    if (isLoading) return;

    if (dailyQuota == 0 && accessChatRav) {
      return (
        <Alert severity="warning" sx={{ marginBottom: 3, width: '100%' }}>
          <AlertTitle>Atenção</AlertTitle>
          Você atingiu o limite de mensagens do dia! <br />
          Para mais informações consulte as regras abaixo ou os termos de uso e
          aquisição.
        </Alert>
      );
    } else if (dailyQuota == 0 && !accessChatRav) {
      return (
        <Alert severity="warning" sx={{ marginBottom: 3, width: '100%' }}>
          <AlertTitle>Atenção</AlertTitle>
          Você atingiu o limite de mensagens do dia! <br /> Ter dúvidas é parte
          do seu caminho para o sucesso. Ao assinar nossa ferramenta exclusiva
          no Brasil, você amplia seu aprendizado e se destaca na concorrência.{' '}
          <br />
          Seja um assinante e conquiste a aprovação no concurso dos seus sonhos!
          <br />
          <Link
            href={'https://ranipassos.com.br/'}
            target="_blank"
            color="inherit"
            rel="noopener noreferrer"
            sx={{ fontWeight: '800' }}
          >
            Saiba Mais
          </Link>
        </Alert>
      );
    }
  }

  const ListItemTextWithHtml: React.FC<{
    text: string;
    question?: boolean;
  }> = ({ text, question }) => {
    const lines = text.split('\n');

    const formattedText = lines.map((line, lineIndex) => (
      <React.Fragment key={lineIndex}>
        {line
          .split(/(\*\*[^*]+\*\*)/)
          .filter(Boolean)
          .map((segment, segmentIndex) => {
            if (segment.startsWith('**') && segment.endsWith('**')) {
              return <b key={segmentIndex}>{segment.slice(2, -2)}</b>;
            }
            return <span key={segmentIndex}>{segment}</span>;
          })}

        {lineIndex < lines.length - 1 ? <br /> : null}
      </React.Fragment>
    ));

    return (
      <>
        {question ? (
          <ListItemText
            primary={
              <Box sx={{ display: 'flex' }}>
                <Avatar alt="Aluno" src={imageAluno} />
                <Box sx={{ marginLeft: '10px', paddingTop: '10px' }}>
                  {formattedText}
                </Box>
              </Box>
            }
          />
        ) : (
          <ListItemText
            secondary={
              <Box sx={{ display: 'flex' }}>
                <Avatar alt="Chat RAV" src={imageRavi} />
                <Box sx={{ marginLeft: '10px' }}>{formattedText}</Box>
              </Box>
            }
          />
        )}
      </>
    );
  };

  // const ListItemTextQuestion: React.FC<{ text: string }> = ({ text }) => {
  //   return (
  //     <ListItemText
  //       primary={
  //         <Box sx={{ display: 'flex' }}>
  //           <Avatar alt="Aluno" src="/static/images/avatar/1.jpg" />
  //           <Box sx={{ marginLeft: '10px', paddingTop: '10px' }}>{text}</Box>
  //         </Box>
  //       }
  //     />
  //   );
  // };

  function renderChat() {
    return (
      <Box sx={{ width: '100%', margin: '0 auto' }}>
        <List
          sx={{
            height: 380,
            overflow: 'auto',
            bgcolor: 'background.paper',
          }}
          ref={messagesEndRef}
        >
          {chatMessages.length == 0 && (
            <ListItem>
              <ListItemText secondary="Fala, lindo(a). Como posso te ajudar?" />
            </ListItem>
          )}

          {chatMessages.map((message, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemTextWithHtml text={message.question} question />
              </ListItem>

              <ListItem>
                <ListItemTextWithHtml text={message.answer} />
              </ListItem>
            </React.Fragment>
          ))}

          {lastMessage && (
            <ListItem>
              <ListItemTextWithHtml text={lastMessage} question />
            </ListItem>
          )}

          {isLoadingMessages && (
            <Box sx={{ width: '100%', padding: 2 }}>
              <Box sx={{ display: 'flex' }}>
                <Avatar alt="Chat RAV" src={imageRavi} />
                <Box sx={{ marginLeft: '10px' }}>
                  <Typography>
                    <b>Enquanto produzo sua resposta, se liga nessa dica:</b>
                  </Typography>
                  <Typography>{tip?.content}</Typography>
                </Box>
                <CircularProgress />
              </Box>
            </Box>
          )}
        </List>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'end',
            marginTop: 2,
            background: '#f9f9f9',
            padding: '12px',
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={rowsTextField()}
            label="Vamos aprender juntos. Pergunte aqui! 📚"
            value={newMessage}
            disabled={dailyQuota == 0 || isLoadingMessages}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{
              width: '93%',
              background: '#fff',
            }}
          />

          <IconButton
            sx={{ p: '10px', marginLeft: 2 }}
            size="large"
            aria-label="directions"
            onClick={() => handleSendMessage()}
          >
            <SendIcon />
          </IconButton>
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
          <Box sx={{ marginBottom: 8, paddingTop: 4 }}>
            {renderLoading()}
            {renderDailyQuota()}
            {renderInformativo()}
            {renderChat()}
            {renderAction()}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Chat;

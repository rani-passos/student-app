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

import logo from 'rani_passos/public/assets/images/logo.svg';

import { IChats, ChatsService } from '../../shared/services/chats/ChatsService';
import { CoursesService } from '../../shared/services/courses/CoursesService';

const ws = new WebSocket(`wss://${Environment.WS}/cable`);

export const Chat = () => {
  const { isAuth } = useAuthContext();

  const [chatMessages, setChatMessages] = React.useState<IChats[]>([]);
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
      setIsLoadingMessages(false);
      setLastMessage('');
      setChatMessages(data.message.messages);
    }
  };

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

    const data = { question: newMessage, answer: '' };
    setNewMessage('');
    ChatsService.create(data).then((result: any) => {
      if (result instanceof Error) {
        console.error('Chats' + result.message);
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

  function chatsGetAll() {
    ChatsService.getAll().then((result: any) => {
      setIsLoading(false);
      if (result instanceof Error) {
        console.error('Chats' + result.message);
      } else {
        setIsLoadingMessages(false);
        setChatMessages(result);
      }
    });
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
    chatsGetAll();
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
            href={'https://ranipassos.com.br'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button sx={{ margin: '16px 0px' }} variant="text">
              Como Usar?
            </Button>
          </Link>
          <Button
            sx={{ margin: '16px 0px' }}
            variant="text"
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
                <li>
                  Alunos não assinantes do Chat-RAV, ou que possuem algum curso
                  com acesso ao Chat-RAV de forma gratuita, terão cortesia de
                  apenas uma pergunta por dia, não acumulável pelos dias não
                  utilizados.
                </li>
                <li>
                  Alunos assinantes do Chat-RAV, ou que possuem algum curso pago
                  com acesso ao Chat-RAV, terão direito a 20 perguntas por dia,
                  não acumulável pelos dias não utilizado.
                </li>
                <li>
                  o RAV é um assistente de Inteligência artificial e não é um
                  modelo funcional para atividades alheias a assuntos de
                  informática e tecnologia da informação.
                </li>
                <li>
                  Esse assistente é constantemente atualizado e melhorado
                  conforme evolução na tecnologia de inteligência artificial no
                  Brasil e no mundo.
                </li>
                <li>
                  Não nos responsabilizamos pelo uso indevido da ferramenta, por
                  exemplo, para utilização visando resultados obscenos, cunho
                  sexual, ilegal, religioso, ou qualquer outro fim diferente do
                  proposto para estudo de informática e tecnologia da
                  Informação.
                </li>
                <li>
                  A tecnologia RAV não é um assistente de analise de edital,
                  consultor de estudos ou guia para outros temas diferentes de
                  informática.
                </li>
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

  const ListItemTextWithHtml: React.FC<{ text: string }> = ({ text }) => {
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
      <ListItemText
        secondary={
          <Box sx={{ display: 'flex' }}>
            <Avatar alt="Chat RAV" src={logo} />
            <Box sx={{ marginLeft: '10px' }}>{formattedText}</Box>
          </Box>
        }
      />
    );
  };

  const ListItemTextQuestion: React.FC<{ text: string }> = ({ text }) => {
    return (
      <ListItemText
        primary={
          <Box sx={{ display: 'flex' }}>
            <Avatar alt="Aluno" src="/static/images/avatar/1.jpg" />
            <Box sx={{ marginLeft: '10px', paddingTop: '10px' }}>{text}</Box>
          </Box>
        }
      />
    );
  };

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
              <ListItemText secondary="Fala, lindo(a). Como posso te ajudar?" />
            </ListItem>
          )}

          {chatMessages.map((message, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemTextQuestion text={message.question} />
              </ListItem>

              <ListItem>
                <ListItemTextWithHtml text={message.answer} />
              </ListItem>
            </React.Fragment>
          ))}

          {lastMessage && (
            <ListItem>
              <ListItemTextQuestion text={lastMessage} />
            </ListItem>
          )}

          {isLoadingMessages && (
            <Box sx={{ width: '100%', padding: 2 }}>
              <LinearProgress />
            </Box>
          )}
        </List>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 2,
          }}
        >
          <TextField
            fullWidth
            label="Vamos aprender juntos. Pergunte aqui! 📚"
            value={newMessage}
            disabled={dailyQuota == 0 || isLoadingMessages}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ width: '93%' }}
          />

          <IconButton
            color="primary"
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
        <Box sx={{ marginTop: 1, marginBottom: 8, paddingTop: 4 }}>
          {renderLoading()}
          {renderDailyQuota()}
          {renderInformativo()}
          {renderChat()}
          {renderAction()}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Chat;

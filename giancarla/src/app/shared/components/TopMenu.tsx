import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useAuthContext, useDrawerContext } from '../../shared/contexts';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/system';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationsService } from '../services/notifications/NotificationsService';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

import logo from 'giancarla/public/assets/images/logo.svg';

type TUser = {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  status: string;
  email: string;
  authentication_token: string;
};

interface INotifications {
  id: number;
  content: string;
  course: string;
}

let user: any = '';

try {
  user = sessionStorage.getItem('USER_CHAR')?.replace(/['"]+/g, '');
  console.log('user:', user);
} catch (error) {
  console.error(error);
}

export const TopMenu = (props: any) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const { isDrawerOpen, toggleDrawerOpen } = useDrawerContext();
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const pages = [
    { name: 'Cursos', url: '/' },
    { name: 'Pedidos', url: '/pedidos' },
    { name: 'Meus Dados', url: '/minha-conta' },
  ];
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [userName, setUserName] = React.useState(user || '');
  const [notifications, setNotifications] = React.useState<INotifications[]>(
    []
  );

  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleSair = () => {
    logout();
    handleCloseUserMenu();
  };

  const handleNavMenu = (url: string) => {
    handleCloseNavMenu();
    navigate(url);
  };

  const handleOpenNavMenu = (event: React.BaseSyntheticEvent) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.BaseSyntheticEvent) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function notificationViewed(id: number) {
    setIsLoading(true);

    NotificationsService.getViewed(id).then((result: any) => {
      if (result instanceof Error) {
        setError(true);
      } else {
        console.log(result);
        NotificationsService.getAll().then((result: any) => {
          if (result instanceof Error) {
            setError(true);
          } else {
            setNotifications(result);
          }
        });
      }
    });

    setIsLoading(false);
  }

  function notificationsContent() {
    return (
      <Tooltip title="Notificações">
        <>
          <IconButton onClick={handleClickOpenDialog}>
            <Badge
              color="primary"
              variant="dot"
              invisible={
                notifications && notifications.length <= 0 ? true : false
              }
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </>
      </Tooltip>
    );
  }

  React.useEffect(() => {
    setIsLoading(true);

    NotificationsService.getAll().then((result: any) => {
      if (result instanceof Error) {
        setError(true);
      } else {
        setNotifications(result);
      }
    });
    setIsLoading(false);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'background.paper',
          color: '#000',
          boxShadow: 'none',
          borderBottom: '1px solid #ddd',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth={props.largura || 'lg'}>
          <Toolbar disableGutters>
            <Box
              component="img"
              src={logo}
              sx={{
                height: 'auto',
                width: 200,
                display: { xs: 'none', md: 'flex' },
                color: 'inherit',
              }}
            />

            {props.drawer && mdDown ? (
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: 'flex', md: 'none' },
                }}
              >
                <Button
                  variant="text"
                  startIcon={<MenuIcon />}
                  onClick={toggleDrawerOpen}
                >
                  Aulas
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: 'flex', md: 'none' },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="primary"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page.url}
                      onClick={() => handleNavMenu(page.url)}
                    >
                      <Typography textAlign="center" color="secondary">
                        {' '}
                        {page.name}{' '}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.url}
                  color={
                    location.pathname === page.url ? 'primary' : 'secondary'
                  }
                  onClick={() => handleNavMenu(page.url)}
                  sx={{ margin: '4px 16px' }}
                >
                  <Typography
                    textAlign="center"
                    variant="button"
                    style={{
                      fontWeight:
                        location.pathname === page.url ? '600' : '400',
                      fontSize: '1rem',
                    }}
                  >
                    {page.name}
                  </Typography>
                </Button>
              ))}
            </Box>

            {notificationsContent()}

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Abrir Preferencias">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }} alt="Avatar">
                    {userName}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => navigate('/')}>
                  <Typography>Cursos</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/pedidos')}>
                  <Typography>Pedidos</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/minha-conta')}>
                  <Typography>Meus dados</Typography>
                </MenuItem>
                <MenuItem onClick={handleSair}>
                  <Typography>Sair</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle id="alert-dialog-title">Notificações</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {notifications.map((notification) => (
              <div key={notification.id}>
                <Tooltip title="Marcar como lida">
                  <IconButton
                    onClick={() => {
                      notificationViewed(notification.id);
                    }}
                  >
                    <NotificationsOffIcon />
                  </IconButton>
                </Tooltip>
                {` ${notification.course}: ${notification.content} `}
              </div>
            ))}
            {notifications.length <= 0
              ? 'Não há novas mensagens por enquanto!'
              : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

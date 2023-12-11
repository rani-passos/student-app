/* eslint-disable indent */
import * as React from 'react';
import { useTheme } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { TermsService } from '../services/terms/TermsService';
import { useAuthContext, useDrawerContext } from '../../shared/contexts';
import {
  INotifications,
  NotificationsService,
} from '../services/notifications/NotificationsService';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import logo from 'rani_passos/public/assets/images/logo.svg';

import {
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  Card,
  CardContent,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Box,
  CardActions,
  MenuItem,
  Tooltip,
  Button,
  Avatar,
  Menu,
  Container,
  Fade,
  Paper,
} from '@mui/material';

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
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [userName, setUserName] = React.useState(user || '');
  const [notifications, setNotifications] = React.useState<INotifications[]>(
    []
  );

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const { isDrawerOpen, toggleDrawerOpen } = useDrawerContext();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const pages = [
    { name: 'Cursos', url: '/' },
    { name: 'Pedidos', url: '/pedidos' },
    { name: 'Chat-RAV', url: '/chat-rav' },
  ];

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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

  const handleClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  function notificationViewed(id: number) {
    // setIsLoading(true);
    // NotificationsService.getViewed(id).then((result: any) => {
    //   if (result instanceof Error) {
    //     setError(true);
    //   } else {
    //     console.log(result);
    //     NotificationsService.getAll().then((result: any) => {
    //       if (result instanceof Error) {
    //         setError(true);
    //       } else {
    //         setNotifications(result);
    //       }
    //     });
    //   }
    // });
    // setIsLoading(false);
  }

  function allNotificationViewed() {
    notifications.forEach((notification) => {
      NotificationsService.getViewed(notification).then((result: any) => {
        if (result instanceof Error) {
          setError(true);
        } else {
          console.log(result);
        }
      });
    });

    setNotifications([]);
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

  React.useEffect(() => {
    TermsService.checkedUser().then((result: any) => {
      if (result instanceof Error) {
        setError(true);
      } else {
        if (!result.checked && location.pathname !== '/termos-uso') {
          navigate('/termos-uso');
        }
      }
    });
  }, []);

  function notificationsContent() {
    return (
      <React.Fragment>
        <Tooltip title="Notificações">
          <>
            <IconButton onClick={handleClick('bottom-end')}>
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
        <Popper
          sx={{ zIndex: 99999 }}
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ marginTop: '10px' }}>
                <Card sx={{ maxWidth: 345 }}>
                  {notifications.length > 0 && (
                    <Box sx={{ overflow: 'auto', maxHeight: '500px' }}>
                      {notifications.map((notification) => (
                        <CardContent key={notification.id}>
                          <Typography variant="body2" component="div">
                            {notification.course}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notification.content}
                          </Typography>
                        </CardContent>
                      ))}
                    </Box>
                  )}

                  {notifications.length <= 0 ? (
                    <CardContent>
                      <Typography variant="body2" component="div">
                        Não há novas mensagens por enquanto!
                      </Typography>
                    </CardContent>
                  ) : (
                    <CardActions sx={{ marginTop: '10px' }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={allNotificationViewed}
                      >
                        Marcar como Lidas
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setOpen(false)}
                      >
                        Fechar
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Paper>
            </Fade>
          )}
        </Popper>
      </React.Fragment>
    );
  }

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

            <Box sx={{ flexGrow: 0 }}>
              <Button
                variant="contained"
                sx={{ marginRight: 4 }}
                href="https://www.ranipassos.com.br/courses/assinatura-completa"
              >
                Seja Assinante
              </Button>
              {notificationsContent()}
              <Tooltip title="Abrir Preferencias">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 2 }}>
                  <Avatar sx={{ bgcolor: 'purple' }} alt="Avatar">
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
                <MenuItem onClick={() => navigate('/minha-conta')}>
                  <Typography>Meus dados</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/')}>
                  <Typography>Cursos</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/pedidos')}>
                  <Typography>Pedidos</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/chat-rav')}>
                  <Typography>Chat-RAV</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate('/termos-uso')}>
                  <Typography>Termos de Uso</Typography>
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

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Footer, TopMenu } from '../../shared/components';
import { styled } from '@mui/material/styles';
import { Chip, LinearProgress, Paper } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../shared/contexts';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  IOrders,
  OrdersService,
} from '../../shared/services/orders/OrdersService';

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function formatDate(data: string) {
  const dataFormatada = new Date(data + 'T03:00:00');
  return dataFormatada.toLocaleDateString('pt-BR');
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2, 4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const Pedidos = () => {
  const { isAuth } = useAuthContext();
  const [pedidos, setPedidos] = React.useState<IOrders[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  function renderStatus(value: string) {
    if (value === 'active') {
      return (
        <Chip
          label="ATIVO"
          color="secondary"
          variant="filled"
          sx={{ width: '100%' }}
        />
      );
    }
    if (value === 'inactive') {
      return (
        <Chip
          label="INATIVO"
          color="error"
          variant="filled"
          sx={{ width: '100%' }}
        />
      );
    }
    if (value === 'paid') {
      return (
        <Chip
          label="PAGO"
          color="success"
          variant="outlined"
          sx={{ width: '100%' }}
        />
      );
    }
    if (value === 'pending') {
      return (
        <Chip
          label="PENDENTE"
          color="primary"
          variant="outlined"
          sx={{ width: '100%' }}
        />
      );
    }
    if (value === 'canceled') {
      return (
        <Chip
          label="CANCELADO"
          color="error"
          variant="outlined"
          sx={{ width: '100%' }}
        />
      );
    } else {
      return '-';
    }
  }

  function renderMethod(value: string) {
    if (value === 'card') {
      return 'Cartão';
    } else if (value === 'pix') {
      return 'PIX';
    } else if (value === 'billet') {
      return 'Boleto';
    } else if (value === 'bonus') {
      return 'Bonûs';
    } else {
      return '-';
    }
  }

  function courseValidate(value: string) {
    if (value === 'active' || value === 'inactive' || value === 'paid') {
      return true;
    }
    return false;
  }

  function Row(props: { row: IOrders }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.course}
          </TableCell>
          <TableCell align="right">{formatDate(row.created_at)}</TableCell>
          <TableCell align="right">{renderStatus(row.status)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {row.payment ? (
                  <Box>
                    <Typography variant="h6" gutterBottom component="div">
                      Dados do Pagamento
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      <b>Método:</b> {renderMethod(row.payment?.method)}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      <b>Valor ($):</b>{' '}
                      {formatter.format((row.payment?.amount | 0) / 100)}
                    </Typography>
                  </Box>
                ) : null}

                {courseValidate(row.status) ? (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      <b>Acesso Liberado:</b> {formatDate(row.access_start)}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      <b>Vencimento:</b>{' '}
                      {row.lifetime
                        ? 'Vitalício'
                        : formatDate(row.access_until)}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  function renderNoRows() {
    if (pedidos.length > 0 && isLoading === false) return;
    return (
      !isLoading && (
        <Alert severity="warning" sx={{ width: '100%' }}>
          <AlertTitle>Atenção</AlertTitle>
          Não há registros de Pedidos!
        </Alert>
      )
    );
  }

  function renderLoading() {
    return (
      !!isLoading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )
    );
  }
  function renderTable() {
    if (pedidos.length === 0) return;
    return (
      !isLoading && (
        <Box sx={{ flexGrow: 1 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: '#fff' }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>-</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell align="right">Data de Criação</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos.map((item) => (
                  <Row key={item.id} row={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  React.useEffect(() => {
    setIsLoading(true);
    OrdersService.getAll().then((result) => {
      setIsLoading(false);
      if (result instanceof Error) {
        console.error('Pedidos' + result.message);
      } else {
        setPedidos(result);
      }
    });
  }, []);

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
          PEDIDOS
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
          {renderNoRows()}
          {renderLoading()}
          {renderTable()}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Pedidos;

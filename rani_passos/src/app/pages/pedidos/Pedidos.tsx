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
      return <Chip label="Ativo" color="secondary" variant="filled" />;
    }
    if (value === 'inactive') {
      return <Chip label="Inativo" color="error" variant="filled" />;
    }
    if (value === 'paid') {
      return <Chip label="PAGO" color="success" variant="outlined" />;
    }
    if (value === 'canceled') {
      return <Chip label="CANCELADO" color="error" variant="outlined" />;
    } else {
      return '-';
    }
  }

  function renderMethod(value: string) {
    if (value === 'card') {
      return 'Cartão';
    }
    if (value === 'pix') {
      return 'PIX';
    }
    if (value === 'billet') {
      return 'Boleto';
    } else {
      return '-';
    }
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
          <TableCell align="right">{formatDate(row.access_start)}</TableCell>

          <TableCell align="right">{row.lifetime ? 'Vitalício' : formatDate(row.access_until)}</TableCell>
          <TableCell align="right">{renderStatus(row.status)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Dados do Pagamento
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Método de Pagamento</TableCell>
                      <TableCell align="right">Valor ($)</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableCell align="right">
                      {renderMethod(row.payment?.method)}
                    </TableCell>
                    <TableCell align="right">
                      {formatter.format((row.payment?.amount | 0) / 100)}
                    </TableCell>
                    <TableCell align="right">
                      {renderStatus(row.payment?.status)}
                    </TableCell>
                    {/* {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.amount * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))} */}
                  </TableBody>
                </Table>
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
        <Grid item xs={12} md={12} lg={12}>
          <Item>
            <Typography variant="h6">Não há registros de Pedidos!</Typography>
          </Item>
        </Grid>
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
    return (
      !isLoading && (
        <Box sx={{ flexGrow: 1 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: '#fff' }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>-</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell align="right">Acesso liberado</TableCell>
                  <TableCell align="right">Validade</TableCell>
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
        const data = result.reverse();
        setPedidos(data);
      }
    });
  }, []);

  return (
    <Box>
      <TopMenu />
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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

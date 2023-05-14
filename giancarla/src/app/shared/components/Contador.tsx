import {
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCountdown } from '../hooks';
import styled from '@emotion/styled';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  padding: 8,
  textAlign: 'center',
  color: '#333',
}));

export const Contador = ({ date }: any) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [day, hour, minute, second] = useCountdown(date);
  return (
    <Grid container spacing={0} sx={{ width: '100%' }}>
      <Grid item xs={2} md={2} lg={2}>
        <Item>
          {' '}
          <Typography variant={smDown ? 'h6' : 'h3'}>{day ? day : '-'}</Typography>
          <Typography>Dias</Typography>
        </Item>
      </Grid>
      <Typography
        variant={smDown ? 'body2' : 'h3'}
        sx={{
          display: 'flex',
          alignSelf: 'center',
          justifyContent: 'center',
          marginLeft: smDown ? '6px' : '12px',
          marginRight: smDown ? '6px' : '12px',
        }}
      >
        :
      </Typography>
      <Grid item xs={2} md={2} lg={2}>
        <Item>
          {' '}
          <Typography variant={smDown ? 'h6' : 'h3'}>{hour ? hour : '-'}</Typography>
          <Typography>Horas</Typography>
        </Item>
      </Grid>
      <Typography
        variant={smDown ? 'body2' : 'h3'}
        sx={{
          display: 'flex',
          alignSelf: 'center',
          justifyContent: 'center',
          marginLeft: smDown ? '6px' : '12px',
          marginRight: smDown ? '6px' : '12px',
        }}
      >
        :
      </Typography>
      <Grid item xs={3} md={2} lg={2}>
        <Item>
          {' '}
          <Typography variant={smDown ? 'h6' : 'h3'}>{minute ? minute : '-'}</Typography>
          <Typography>Minutos</Typography>
        </Item>
      </Grid>
      <Typography
        variant={smDown ? 'body2' : 'h3'}
        sx={{
          display: 'flex',
          alignSelf: 'center',
          justifyContent: 'center',
          marginLeft: smDown ? '6px' : '12px',
          marginRight: smDown ? '6px' : '12px',
        }}
      >
        :
      </Typography>
      <Grid item xs={3} md={2} lg={2}>
        <Item>
          {' '}
          <Typography variant={smDown ? 'h6' : 'h3'}>{second ? second : '-'}</Typography>
          <Typography>Segundos</Typography>
        </Item>
      </Grid>
    </Grid>
  );
};

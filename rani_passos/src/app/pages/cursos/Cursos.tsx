import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {
  CardActionArea,
  Grid,
  IconButton,
  InputBase,
  Pagination,
  Alert,
  AlertTitle,
} from '@mui/material';
import { LinearProgress } from '@mui/material';
import { CoursesService } from '../../shared/services/courses/CoursesService';
import { Environment } from '../../shared/environment';
import { ICoursesList } from '../../shared/services/courses/CoursesService';
import { Navigate, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../../shared/hooks';
import { useAuthContext } from '../../shared/contexts';

export const Cursos: React.FC = () => {
  const { isAuth } = useAuthContext();

  const navigate = useNavigate();
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [coursesList, setCoursesList] = React.useState<ICoursesList[]>([]);
  const [qtdCourses, setQtdCourses] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const handlePageChange = (event: React.BaseSyntheticEvent, value: number) => {
    setPage(value);
  };

  const { debounce } = useDebounce();

  // function renderHtml(e: string) {
  //   const htmlToReactParser = new Parser();
  //   const reactElement = htmlToReactParser.parse(e);
  //   return reactElement;
  // }

  function renderPagination() {
    if ((!isLoading && coursesList.length >= 8) || page !== 1) {
      return (
        <Box
          style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}
        >
          <Pagination
            color="primary"
            count={qtdCourses}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      );
    }
  }

  function renderLoading() {
    return (
      !!isLoading && (
        <Box sx={{ width: '100%', mb: 8, mt: 2 }}>
          <LinearProgress />
        </Box>
      )
    );
  }
  function renderNoContent() {
    return (
      !isLoading &&
      coursesList.length <= 0 && (
        <Alert severity="warning" sx={{ width: '100%' }}>
          <AlertTitle>Atenção</AlertTitle>
          Sem Cursos disponíveis.{' '}
          <strong>Entre em contato com o suporte!</strong>
        </Alert>
      )
    );
  }
  function renderCourses() {
    return (
      coursesList.length > 0 &&
      coursesList.map((curso) => (
        <Grid item xs={12} md={6} lg={4} key={curso.id}>
          <Card>
            <CardActionArea onClick={() => navigate(`/curso/${curso.id}`)}>
              <CardMedia
                component="img"
                image={
                  curso.image.includes('https://')
                    ? curso.image
                    : `${curso.image}`
                }
                alt="imagem do curso"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="p"
                  color="secondary"
                  sx={{ textAlign: 'center' }}
                >
                  {curso.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))
    );
  }

  const handleSearch = (e: React.BaseSyntheticEvent) => {
    setSearchTerm(e.target.value);
  };
  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    console.log(e.target);
  };

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      CoursesService.getAll(page, searchTerm).then((result) => {
        setIsLoading(false);
        console.log('isLoadingCoursesService', isLoading);

        if (result instanceof Error) {
          setError(true);
        } else {
          setQtdCourses(Math.ceil(result.qtd_total / 10));
          setCoursesList(result.courses);
        }
      });
    });
  }, [page, searchTerm]);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          marginTop: { xs: '100px', sm: '100px', md: '36px' },
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            margin: '0px auto',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        >
          {coursesList.length > 0 && (
            <form onSubmit={handleSubmit}>
              <InputBase
                sx={{ margin: '4px 0px 0px 16px', flex: 1 }}
                placeholder="Pesquisar Cursos"
                value={searchTerm}
                onChange={handleSearch}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </form>
          )}
        </Box>
      </Box>
      <Grid
        container
        component="main"
        maxWidth="lg"
        spacing={2}
        sx={{
          padding: { xs: '20px' },
          width: { xs: '99%', md: '100%' },
          display: 'flex',
          margin: '0px auto',
          justifyContent: 'center',
        }}
      >
        {renderLoading()}
        {renderNoContent()}
        {renderCourses()}
      </Grid>
      {renderPagination()}
    </div>
  );
};
export default Cursos;

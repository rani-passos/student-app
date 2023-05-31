import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, redirect, useParams } from 'react-router-dom';
import { Contador, MenuLateral } from '../../shared/components';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import {
  CoursesService,
  IModules,
} from '../../shared/services/courses/CoursesService';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import DownloadIcon from '@mui/icons-material/Download';
import { useAuthContext } from '../../shared/contexts';
import CourseContext from '../../shared/contexts/CourseContext';
import { useCountdown } from '../../shared/hooks';

interface ILesson {
  id: number;
  title: string;
  released: boolean;
  description?: string;
  videos?: string[];
  medias?: [name: string, file: string];
  attended?: boolean;
}

// let lastLesson: any = undefined;
// try {
//   lastLesson = JSON.parse(sessionStorage.getItem('LESSON') || '');
// } catch (error) {
//   console.log(error);
// }

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export const Aula: React.FC = () => {
  const { isAuth } = useAuthContext();
  const data = useContext(CourseContext);

  const windowWidth = useRef(window.innerWidth);
  // const windowHeight = useRef(window.innerHeight);
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams<'id'>();
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<IModules[]>([]);
  const [title, setTitle] = useState('');
  const [videos, setVideos] = useState<ILesson>();
  const [haveMedias, setHaveMedias] = useState(false);
  const [aula, setAula] = useState(0);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [attended, setAttended] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  function haveVideo() {
    const video = videos?.videos?.map((a) => {
      if (a) {
        return true;
      }
      return false;
    });
    if (video !== undefined && !video[0]) {
      return false;
    }
    return true;
  }

  function handleAula(event: React.BaseSyntheticEvent, novaAula: any) {
    setAula(novaAula);
  }

  function checkFileType(file: string) {
    const fileType = file.split('.').pop();
    return fileType;
  }

  const lesson = (data: ILesson) => {
    setActiveLesson(data.id);
    setAttended(data.attended ? data.attended : false);
    setVideos(data);
    setAula(0);
  };

  const module = (data: number) => {
    setActiveModule(data);
  };

  function renderiframe(video: string, x = '640', y = '360') {

    let plyrProps: any;

    if (video.includes('pandavideo')) {
      plyrProps = (
        <iframe 
          id={`panda-${video.split('?v=')[1]}`} 
          src={video} 
          style={{border: 'none'}}
          allow='accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture' 
          allowFullScreen
          width={x} 
          height={y} 
        ></iframe>
      );
    } else if (video.includes('youtube')) {
      const id = video.substring(video.length - 11);
      plyrProps = (
        <iframe 
          width={x} 
          height={y} 
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video player" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      );
    } else {
      plyrProps = (
        <iframe
          src={'https://player.vimeo.com/video/' + video.split('/')[3]}
          width={x}
          height={y}
          allow='autoplay; fullscreen'
          allowFullScreen
        ></iframe>
      );
    }

    return (
      <Box
        sx={{ mb: 4 }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
        key={video}
      >
        {
          plyrProps
        }
      </Box>
    );
  }

  function renderVideo(video: string) {
    if (smDown) {
      return renderiframe(video, `${windowWidth.current}`, 'auto');
      // return renderiframe(video, '350', '180');
    }
    return renderiframe(video);
  }

  function renderMedias(medias: any) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6">Arquivos</Typography>
        <Box
          sx={{
            marginLeft: { md: '40px' },
            minWidth: '100px',
            height: 'auto',
            minHeight: '250px',
            borderRadius: '10px',
          }}
        >
          {medias.map((media: any, index: number) => (
            <Paper
              elevation={3}
              sx={{
                backgroundColor: '#f1f1f1',
                margin: '8px',
                padding: '16px',
                borderRadius: '8px',
                width: smDown ? '1' : 1 / 2,
              }}
              key={index}
            >
              {checkFileType(media.file) === 'pdf' ? (
                <PictureAsPdfIcon color="primary" style={{ margin: '0 4px' }} />
              ) : (
                ''
              )}
              <Typography variant="body1">Arquivo: {media.name}</Typography>
              <Link href={`https://filipeavila.com${media.file}`} target='_blank' rel='noopener no referrer'>
                <Button
                  sx={{ margin: '16px 0px' }}
                  variant="contained"
                  startIcon={<DownloadIcon />}
                >
                  Baixar
                </Button>
              </Link>
              {checkFileType(media.file) === 'mp3' ? (
                <Box sx={{ padding: '16px 0px' }}>
                  <Typography variant="body1">Player Online 🔊</Typography>
                  <audio controls style={{ color: 'red' }}>
                    <source src={media.file} type="audio/mpeg" />
                    Seu Browser não suporta o player, por favor use outro.
                  </audio>
                </Box>
              ) : (
                ''
              )}
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }

  function renderClassContent(videos: any) {
    return (
      <Box
        sx={{ mb: 2, mr: smDown ? 0 : 16, width: '100%', maxWidth: '1124px' }}
      >
        {videos?.released ? (
          <Box style={{ minHeight: '100vh', width: '100%' }}>
            <Box
              style={{
                display: 'flex',
                flexDirection: smDown ? 'column' : 'row',
                justifyContent: smDown ? '' : 'space-between',
                padding: '50px 16px 0px 16px',
              }}
            >
              {modules.length <= 0 ? 'Sem Aulas ainda!' : ''}
              <Typography variant="h5">{videos?.title}</Typography>
              <Button variant="outlined" onClick={toggleAulaConcluida}>
                {attended ? 'Desmarcar ' : 'Marcar '} {'como concluída'}
              </Button>
            </Box>
            {haveVideo() ? (
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: 'white',
                  display: smDown ? 'block' : 'flex',
                  height: '450px',
                  maxWidth: '100%',
                }}
              >
                <Tabs
                  orientation={smDown ? 'horizontal' : 'vertical'}
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  value={aula}
                  onChange={handleAula}
                  aria-label="Vertical tabs example"
                  sx={{ border: 0, borderColor: 'white' }}
                >
                  {videos?.videos?.map((_: any, index: any) => (
                    <Tab
                      icon={<PlayCircleOutlineIcon fontSize="large" />}
                      key={index}
                      label={`Parte ${index + 1}`}
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>
                {videos?.videos?.map((a: any, index: any) => (
                  <TabPanel key={index} value={aula} index={index}>
                    {renderVideo(a)}
                  </TabPanel>
                ))}
              </Box>
            ) : (
              ''
            )}
            {videos?.description ? (
              <Box sx={{ display: 'block', padding: '0px 16px' }}>
                <Typography variant="h6">Descrição</Typography>
                <Box sx={{ marginLeft: { md: '40px' } }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: videos?.description || '',
                    }}
                  />
                </Box>
              </Box>
            ) : (
              ''
            )}
            {haveMedias ? (
              <Box
                style={{
                  backgroundColor: '#FFF',
                  maxHeight: '100vh',
                  width: '100%',
                }}
              >
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                  }}
                >
                  <Box style={{ display: 'flex' }}>
                    {renderMedias(videos?.medias)}
                  </Box>
                </Box>
              </Box>
            ) : (
              ''
            )}
          </Box>
        ) : videos?.released ? (
          <Box
            style={{
              backgroundColor: '#FFF',
              minHeight: '100vh',
              width: '100%',
              padding: '32px',
            }}
          >
            <h5>Escolha uma aula</h5>
          </Box>
        ) : (
          <Box
            sx={{
              marginTop: '64px',
              paddingLeft: smDown ? '8px' : '32px',
              width: '100%',
            }}
          >
            <p>Aula estará disponível em breve!</p>
            <Contador date={videos?.release_date} />
            <h4 style={{ marginTop: '32px' }}>
              Para mais informações entre em contato!
            </h4>
          </Box>
        )}
      </Box>
    );
  }
  function toggleAulaConcluida() {
    setTimeout(() => {
      if (activeLesson === 0 || activeModule === 0) return;
      !attended ? handleAulaConcluida() : handleNaoAulaConcluida();
    }, 200);
  }

  function handleAulaConcluida() {
    setAttended(true);
    setIsLoading(true);
    CoursesService.getAttended(Number(id), activeModule, activeLesson).then(
      (result) => {
        if (result instanceof Error) {
          setError(true);
        } else {
          CoursesService.getModulesById(Number(id)).then((result) => {
            if (result instanceof Error) {
              setError(true);
            } else {
              setTitle(result.course.title);
              setModules(result.course.capsules);
              setActiveLesson(activeLesson);
              setActiveModule(activeModule);
            }
          });
        }
      }
    );
    setIsLoading(false);
  }
  function handleNaoAulaConcluida() {
    setAttended(false);

    setIsLoading(true);
    CoursesService.getNotAttended(Number(id), activeModule, activeLesson).then(
      (result) => {
        if (result instanceof Error) {
          setError(true);
        } else {
          CoursesService.getModulesById(Number(id)).then((result) => {
            if (result instanceof Error) {
              setError(true);
            } else {
              setTitle(result.course.title);
              setModules(result.course.capsules);
              setActiveLesson(activeLesson);
              setActiveModule(activeModule);
            }
          });
        }
      }
    );
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);

    CoursesService.getModulesById(Number(id)).then((result) => {
      if (result instanceof Error) {
        setError(true);
      } else {
        setTitle(result.course.title);
        setModules(result.course.capsules);
        setActiveLesson(result.course.capsules[0].lessons[0].id);
        setActiveModule(result.course.capsules[0].id);
        setIsLoading(false);
      }
      console.log(
        'Number(id), activeModule, activeLesson',
        Number(id),
        activeModule,
        activeLesson
      );
    });
  }, [id]);

  useEffect(() => {
    const lesson = videos;
    lesson?.medias?.length ? setHaveMedias(true) : setHaveMedias(false);
  }, [videos]);

  useEffect(() => {
    if (videos === undefined && modules.length > 0) {
      // if (lastLesson) {
      //   setVideos(lastLesson);
      // } else {
      // setVideos(modules[0].lessons[0]);
      // }
      setVideos(modules[0].lessons[0]);
    }
  }, [modules]);

  useEffect(() => {
    if (error) {
      redirect('/');
    }
  }, [error]);

  return (
    // <CourseContext.Provider value={['teste']}>
    <MenuLateral
      courseTitle={title}
      curso={modules}
      lesson={lesson}
      activeModule={module}
      toggleAulaConcluida={toggleAulaConcluida}
    >
      <Grid container width={'100%'}>
        {isLoading ? (
          <>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
              onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        ) : (
          ''
        )}
        {renderClassContent(videos)}
      </Grid>
    </MenuLateral>
    // </CourseContext.Provider>
  );
};

export default Aula;

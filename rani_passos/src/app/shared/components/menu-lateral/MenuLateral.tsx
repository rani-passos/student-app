import {
  AppBar,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListSubheader,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { IModules } from '../../services/courses/CoursesService';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useDrawerContext } from '../../contexts';
import { TopMenu } from '../TopMenu';
import VerifiedIcon from '@mui/icons-material/Verified';
import CourseContext from '../../contexts/CourseContext';

type Props = {
  children?: React.ReactNode;
  courseTitle?: string;
  curso?: IModules[];
  activeModule: (data: number) => void;
  lesson: (data: ILessons) => void;
};

interface ILessons {
  id: number;
  title: string;
  released: boolean;
  description?: string;
  attended?: boolean;
}

const drawerWidth = 300;

export const MenuLateral: React.FC<Props> = ({
  children,
  courseTitle,
  curso,
  lesson,
  activeModule,
}) => {
  const data = useContext(CourseContext);

  const navigate = useNavigate();
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const { isDrawerOpen, toggleDrawerOpen } = useDrawerContext();
  const [open, setOpen] = useState(0);

  const handleBack = () => {
    navigate('/');
  };

  const handleClick = (id: number) => {
    setOpen(id);
  };

  const handleLessonClick = (l: ILessons, m: number) => {
    console.log('l,m', l.id, m);
    lesson(l);
    activeModule(m);
  };

  function renderModules(m: IModules, index: number) {
    return (
      <div key={m.id + index}>
        <ListItemButton onClick={() => handleClick(m.id)}>
          <ListItemIcon
            sx={{ minWidth: '32px', paddingLeft: '2px' }}
          ></ListItemIcon>
          <ListItemText
            disableTypography
            primary={
              <Typography sx={{ fontWeight: 'bold' }}>{m.name}</Typography>
            }
          />
          {open === m.id ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        {m.lessons?.map((l) => renderLessons(l, m.id))}
      </div>
    );
  }

  function renderLessons(l: ILessons, id: number) {
    return (
      <Collapse key={l.id + id} in={open === id} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            sx={{
              paddingTop: '2px',
              paddingBottom: '2px',
              paddingLeft: '36px',
            }}
            onClick={() => handleLessonClick(l, id)}
          >
            <Checkbox
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<VerifiedIcon />}
              checked={l.attended}
              color="success"
            />
            <ListItemText
              primary={`${l.title}`}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        </List>
      </Collapse>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopMenu largura="false" drawer />
      <Drawer
        open={isDrawerOpen}
        variant={mdDown ? 'temporary' : 'permanent'}
        onClose={toggleDrawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          ['& .MuiDrawer-paper']: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box width={'299px'} sx={{ marginTop: '50px', overflow: 'auto' }}>
          <List
            sx={{
              width: '100%',
              maxWidth: drawerWidth,
              bgcolor: 'background.paper',
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="p"
                color="primary"
                sx={{
                  fontSize: '16px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}
              >
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<ChevronLeftIcon />}
                  onClick={handleBack}
                  sx={{ marginTop: '8px' }}
                >
                  Voltar
                </Button>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    lineHeight: '24px',
                  }}
                >
                  {courseTitle}
                </Box>
              </ListSubheader>
            }
          >
            <Divider />
            {curso?.map((m, index) => renderModules(m, index))}
          </List>
        </Box>
      </Drawer>
      <Box
        height="100vh"
        component="main"
        sx={{ flexGrow: 1 }}
        marginLeft={mdDown ? 0 : theme.spacing(4)}
        marginTop={theme.spacing(6)}
      >
        {children}
      </Box>
    </Box>
  );
};

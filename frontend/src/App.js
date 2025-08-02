import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Snackbar, Alert,
  CssBaseline, AppBar, Toolbar, FormControlLabel, Switch,
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton,
  Divider, Card, CardContent, Chip, Avatar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';

const API_URL = 'http://192.168.1.176:4000'; // เปลี่ยนเป็น URL backend จริง

function LatestList({ type, onBack }) {
  const [queue, setQueue] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [lastId, setLastId] = useState(null);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await axios.get(`${API_URL}/queue?type=${type}`);
        const latest = res.data.slice(0, 20);
        if (latest.length && (!lastId || (latest[0] && latest[0].time !== lastId))) {
          if(lastId) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 1500);
          }
          if(latest[0]) setLastId(latest[0].time);
        }
        setQueue(latest);
        if(latest.length === 0) setLastId(null);
      } catch {
        setQueue([]);
      }
    }, 1200);
    return () => clearInterval(timer);
  }, [type, lastId]);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Button
        variant="outlined"
        onClick={onBack}
        startIcon={<HomeIcon />}
        sx={{ mb: 3, fontSize: '1.2rem', px: 4, py: 2 }}
      >
        ย้อนกลับ
      </Button>
      
      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Card sx={{ flex: 1, background: 'linear-gradient(45deg, #2196F3, #21CBF3)' }}>
          <CardContent sx={{ color: 'white', textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {queue.length}
            </Typography>
            <Typography variant="body2">รายการทั้งหมด</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)' }}>
          <CardContent sx={{ color: 'white', textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {type === 'male' ? 'ตึกชาย' : 'ตึกหญิง'}
            </Typography>
            <Typography variant="body2">ประเภท</Typography>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setShowAlert(false)}
        autoHideDuration={1500}
      >
        <Alert severity="success" sx={{ fontSize: '1.2rem', fontWeight: 700 }}>
          🎯 New scan detect!
        </Alert>
      </Snackbar>
      
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                ชื่อ
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>
                <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                ทะเบียน
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>
                <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                ห้อง
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queue.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="h6" color="textSecondary">
                    🔍 ยังไม่มีข้อมูล
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {queue.map((item, idx) => (
              <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ fontSize: '1.15rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: type === 'male' ? 'primary.main' : 'secondary.main' }}>
                      {item.name.charAt(0)}
                    </Avatar>
                    {item.name}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '1.15rem' }}>
                  <Chip label={item.registration} color="primary" size="small" />
                </TableCell>
                <TableCell sx={{ fontSize: '1.15rem' }}>
                  <Chip label={item.room} color="secondary" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

function LastDayList({ onBack }) {
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Button variant="outlined" onClick={onBack} startIcon={<HomeIcon />} sx={{ mb: 3 }}>
        ย้อนกลับ
      </Button>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        📅 รายการเมื่อวาน
      </Typography>
      <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <HistoryIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5">ฟีเจอร์กำลังพัฒนา</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            ระบบจะแสดงข้อมูลการสแกนเมื่อวานในเร็วๆ นี้
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

function SpecPage({ onBack }) {
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Button variant="outlined" onClick={onBack} startIcon={<HomeIcon />} sx={{ mb: 3 }}>
        ย้อนกลับ
      </Button>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        ⚙️ ข้อมูลเทคนิค
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🖥️ Backend
            </Typography>
            <Typography>• Node.js + Express</Typography>
            <Typography>• CSV Database</Typography>
            <Typography>• RFID UID Processing</Typography>
            <Typography>• Real-time Queue System</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="secondary">
              🌐 Frontend
            </Typography>
            <Typography>• React.js + Material-UI</Typography>
            <Typography>• Dark/Light Mode</Typography>
            <Typography>• Responsive Design</Typography>
            <Typography>• Real-time Updates</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#4CAF50' }}>
              🔧 Hardware
            </Typography>
            <Typography>• Raspberry Pi</Typography>
            <Typography>• RFID Reader</Typography>
            <Typography>• Python Integration</Typography>
            <Typography>• WiFi Network</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

function InfoPage({ onBack }) {
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Button variant="outlined" onClick={onBack} startIcon={<HomeIcon />} sx={{ mb: 3 }}>
        ย้อนกลับ
      </Button>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        👨‍💻 ข้อมูลผู้จัดทำ
      </Typography>
      <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom>RFID Cloud System</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ระบบสแกนบัตร RFID แบบ Real-time
          </Typography>
          <Chip label="Version 1.0" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2">
              🚀 Deployed on Render
            </Typography>
            <Typography variant="body2">
              💻 Built with React + Node.js
            </Typography>
            <Typography variant="body2">
              🤖 Powered by Claude AI
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#9c27b0' },
        success: { main: '#4caf50' }
      },
    }), [darkMode]
  );

  const menuItems = [
    { text: 'หน้าแรก', icon: <HomeIcon />, action: () => setPage('home') },
    { text: 'ตึกชาย', icon: <PeopleIcon />, action: () => setPage('male') },
    { text: 'ตึกหญิง', icon: <PeopleIcon />, action: () => setPage('female') },
    { text: 'รายการเมื่อวาน', icon: <HistoryIcon />, action: () => setPage('lastday') },
    { text: 'ข้อมูลเทคนิค', icon: <SettingsIcon />, action: () => setPage('spec') },
    { text: 'ข้อมูลผู้จัดทำ', icon: <InfoIcon />, action: () => setPage('info') }
  ];

  const renderHome = () => (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" gutterBottom sx={{ fontWeight: 900, mb: 6, background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
        🎯 RFID Cloud System
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 6, flexWrap: 'wrap' }}>
        <Card sx={{ width: 250, height: 160, cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }} onClick={() => setPage('male')}>
          <CardContent sx={{ color: 'white', textAlign: 'center', py: 4 }}>
            <PeopleIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>ตึกชาย</Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ width: 250, height: 160, cursor: 'pointer', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }} onClick={() => setPage('female')}>
          <CardContent sx={{ color: 'white', textAlign: 'center', py: 4 }}>
            <PeopleIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>ตึกหญิง</Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
        🚀 แตะเมนู ☰ เพื่อดูฟีเจอร์เพิ่มเติม
      </Typography>
    </Container>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            RFID Cloud
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                icon={<LightModeIcon />}
                checkedIcon={<DarkModeIcon />}
              />
            }
            label=""
          />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 2, p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>🎯 RFID Menu</Typography>
          </Box>
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} onClick={() => { item.action(); setDrawerOpen(false); }}>
                <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Version 1.0 | Made with ❤️
            </Typography>
          </Box>
        </Box>
      </Drawer>

      <Toolbar />
      {page === 'home' && renderHome()}
      {page === 'male' && <LatestList type="male" onBack={() => setPage('home')} />}
      {page === 'female' && <LatestList type="female" onBack={() => setPage('home')} />}
      {page === 'lastday' && <LastDayList onBack={() => setPage('home')} />}
      {page === 'spec' && <SpecPage onBack={() => setPage('home')} />}
      {page === 'info' && <InfoPage onBack={() => setPage('home')} />}
    </ThemeProvider>
  );
}

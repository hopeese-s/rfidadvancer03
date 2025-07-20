import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  IconButton,
  Switch,
  CssBaseline,
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Button,
  FormControlLabel
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const API_URL = 'https://rfidadvancer03.onrender.com'; // เปลี่ยนตาม backend จริง

function LatestList({ type, onBack }) {
  const [queue, setQueue] = useState([]);
  const [lastCheck, setLastCheck] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await axios.get(`${API_URL}/queue?type=${type}`);
        const latest = res.data.slice(0, 20);
        if (latest.length > 0 && latest[0].time !== lastCheck) {
          if (lastCheck !== null) {
            // ไม่แสดง alert ครั้งแรกที่เข้าหน้า
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 1500);
          }
          setLastCheck(latest[0].time);
        }
        setQueue(latest);
      } catch {
        setQueue([]);
      }
    }, 1200);
    return () => clearInterval(timer);
  }, [type, lastCheck]);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Button onClick={onBack} variant="outlined" sx={{ mb: 3 }}>
        ย้อนกลับ
      </Button>
      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setShowAlert(false)}
        autoHideDuration={1500}
      >
        <Alert severity="success" sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
          New scan detected!
        </Alert>
      </Snackbar>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ชื่อ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ทะเบียน</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ห้อง</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queue.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">-</TableCell>
              </TableRow>
            )}
            {queue.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.registration}</TableCell>
                <TableCell>{item.room}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

function App() {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' }
    }
  }), [darkMode]);

  const renderHome = () => (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom fontWeight={700}>เลือกรายการ</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mt: 4 }}>
        <Button
          variant="contained"
          sx={{
            width: 260, height: 130, fontSize: '2rem',
            background: '#1976d2', color: '#fff', fontWeight: 700
          }}
          onClick={() => setPage('male')}
        >
          ตึกชาย
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            width: 260, height: 130, fontSize: '2rem', fontWeight: 700
          }}
          onClick={() => setPage('female')}
        >
          ตึกหญิง
        </Button>
      </Box>
    </Container>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <FormControlLabel
            label={darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode((v) => !v)}
              />
            }
          />
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* AppBar padding */}
      {page === 'home' && renderHome()}
      {page === 'male' && <LatestList type="male" onBack={() => setPage('home')} />}
      {page === 'female' && <LatestList type="female" onBack={() => setPage('home')} />}
    </ThemeProvider>
  );
}

export default App;

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './Header';
import 'react-toastify/dist/ReactToastify.css';
import { useStoreContext } from '../context/StoreContext';
import { getCookie } from '../util/util';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const buyerId = getCookie('buyerId');
    if (buyerId) {
      agent.Basket.get()
        .then((basket) => setBasket(basket))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#fff' : '#303030'
      }
    }
  });

  if (loading) return <LoadingComponent message="Initialising app..."></LoadingComponent>;

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} setDarkMode={setDarkMode}></Header>
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;

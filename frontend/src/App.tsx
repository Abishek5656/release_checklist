import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ListReleasesScreen } from './features/releases/screens/ListReleasesScreen';
import { ReleaseDetailScreen } from './features/releases/screens/ReleaseDetailScreen';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastProvider } from './contexts/ToastContext';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const theme = createTheme({
  palette: {
    primary: { main: '#6366f1' },
    background: { default: '#f1f5f9' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  }
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ListReleasesScreen />} />
            <Route path="/release/:id" element={<ReleaseDetailScreen />} />
          </Routes>
        </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

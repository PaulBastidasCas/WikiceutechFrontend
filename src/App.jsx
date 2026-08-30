import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './javascript/Auth';
import Home from './javascript/Home';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
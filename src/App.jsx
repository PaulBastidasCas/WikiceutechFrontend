import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './javascript/Auth';
import Home from './javascript/Home';
import Profile from './javascript/Profile';
import Layout from './components/Layout';
import ResetPassword from './javascript/ResetPassword'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
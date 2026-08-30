import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './javascript/Auth';
import Home from './javascript/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
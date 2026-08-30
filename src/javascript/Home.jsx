import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>¡Bienvenido a la Wiki! 🎉</h1>
      <p>Has iniciado sesión correctamente.</p>
      <button 
        onClick={handleLogout}
        style={{ padding: '10px 20px', background: '#2575fc', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
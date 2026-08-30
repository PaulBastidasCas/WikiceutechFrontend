import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, registerUser, verifyUser, recoverPassword } from '../services/authService';
import { ArrowLeft, Eye, EyeOff, Star } from 'lucide-react';
import '../styles/Auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [view, setView] = useState(location.state?.view || 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '', 
    email: location.state?.email || '', 
    password: '', 
    code: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    try {
      if (view === 'login') {
        await loginUser(formData.email, formData.password);
        navigate('/home');
      } else if (view === 'register') {
        await registerUser(formData.username, formData.email, formData.password);
        setView('verify');
        setMsg('Revisa tu correo para el código de verificación.');
      } else if (view === 'verify') {
        await verifyUser(formData.email, formData.code);
        setView('login');
        setMsg('Cuenta verificada exitosamente.');
      } else if (view === 'recover') {
        await recoverPassword(formData.email);
        setMsg('Si el correo existe, recibirás un enlace.');
        setView('login');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error en la solicitud';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <header className="auth-header">
        <h1>
          {view === 'login' && 'Inicia sesión en la Wiki'}
          {view === 'register' && 'Únete a la Wiki Hoy'}
          {view === 'verify' && 'Verifica tu identidad'}
          {view === 'recover' && 'Recupera tu contraseña'}
        </h1>
        <p>
          {view === 'login' ? 'La mayor plataforma de conocimiento creada por estudiantes.' : 'Explora, edita y comparte conocimiento.'}
        </p>
      </header>

      <div className="auth-overlap-icon">
        <div className="honduras-circle">
          <div className="hn-stars">
            <div className="star-row top">
              <Star size={12} fill="#00bce4" color="#00bce4" />
              <Star size={12} fill="#00bce4" color="#00bce4" />
            </div>
            <div className="star-row middle">
              <Star size={12} fill="#00bce4" color="#00bce4" />
            </div>
            <div className="star-row bottom">
              <Star size={12} fill="#00bce4" color="#00bce4" />
              <Star size={12} fill="#00bce4" color="#00bce4" />
            </div>
          </div>
        </div>
      </div>

      <div className="auth-body">
        <div className="auth-content-wrapper">
          <div className="auth-top-bar">
            <button
              className="back-btn"
              onClick={() => view === 'login' ? navigate('/home') : setView('login')}
            >
              <ArrowLeft size={18} /> {view === 'login' ? 'ATRÁS' : 'VOLVER'}
            </button>
          </div>

          <div className="auth-content-centered">
            <div className="auth-form-column">
              <h3>
                {view === 'login' ? 'Iniciar sesión' :
                  view === 'register' ? 'Registrarse' :
                    view === 'verify' ? 'Verificación' : 'Recuperación'}
              </h3>

              {error && <div className="alert-message error">{error}</div>}
              {msg && <div className="alert-message success">{msg}</div>}

              <form onSubmit={handleSubmit}>
                {view === 'register' && (
                  <div className="form-group">
                    <label>Nombre de usuario <span>*</span></label>
                    <input type="text" name="username" placeholder="Nombre de usuario" required onChange={handleChange} value={formData.username} />
                  </div>
                )}

                {(view !== 'verify' || view === 'verify') && (
                  <div className="form-group">
                    <label>Correo electrónico <span>*</span></label>
                    <input type="email" name="email" placeholder="Correo electrónico" required onChange={handleChange} value={formData.email} />
                  </div>
                )}

                {(view === 'login' || view === 'register') && (
                  <div className="form-group password-group">
                    <label>Contraseña <span>*</span></label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Contraseña"
                        required
                        onChange={handleChange}
                        value={formData.password}
                      />
                      <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {view === 'verify' && (
                  <div className="form-group">
                    <label>Código de verificación <span>*</span></label>
                    <input type="text" name="code" placeholder="Código de 6 dígitos" required maxLength="6" onChange={handleChange} value={formData.code} />
                  </div>
                )}

                {view === 'login' && (
                  <button type="button" className="forgot-password" onClick={() => setView('recover')}>
                    ¿Olvidaste tu contraseña?
                  </button>
                )}

                {view === 'login' && (
                  <p className="terms-text">
                    Al continuar, aceptas las <strong>Condiciones de uso</strong> y la <strong>Política de privacidad</strong> de la Wiki.
                  </p>
                )}

                <button type="submit" className="fandom-submit-btn" disabled={loading}>
                  {loading ? 'Cargando...' : view === 'login' ? 'INICIAR SESIÓN' : view === 'register' ? 'REGISTRARSE' : view === 'verify' ? 'VERIFICAR' : 'ENVIAR'}
                </button>
              </form>

              <div className="auth-switch">
                {view === 'login' ? (
                  <p>¿No tienes cuenta? <button type="button" onClick={() => setView('register')}>Regístrate ahora</button></p>
                ) : view === 'register' ? (
                  <p>¿Ya tienes cuenta? <button type="button" onClick={() => setView('login')}>Inicia sesión</button></p>
                ) : (
                  <p><button type="button" onClick={() => setView('login')}>Volver al login</button></p>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="custom-footer">
          Ingeniería en Software
        </footer>
      </div>
    </div>
  );
}
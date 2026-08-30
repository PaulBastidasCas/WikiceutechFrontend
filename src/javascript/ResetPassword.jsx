import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { Eye, EyeOff, Star } from 'lucide-react';
import '../styles/Auth.css';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');

        if (!token) {
            setError('Enlace inválido o expirado. Falta el token de seguridad.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, password);
            setMsg('Contraseña actualizada con éxito. Redirigiendo al login...');
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err) {
            console.error("Detalle del error:", err.response?.data);
            const serverMessage = err.response?.data?.message || err.response?.data || 'Error al restablecer la contraseña.';
            setError(typeof serverMessage === 'string' ? serverMessage : 'Error al restablecer la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <header className="auth-header">
                <h1>Crea tu nueva contraseña</h1>
                <p>Ingresa una contraseña segura para recuperar tu cuenta en la Wiki.</p>
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
                    <div className="auth-content-centered">
                        <div className="auth-form-column">
                            <h3>Restablecer Contraseña</h3>

                            {error && <div className="alert-message error">{error}</div>}
                            {msg && <div className="alert-message success">{msg}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group password-group">
                                    <label>Nueva Contraseña <span>*</span></label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Nueva contraseña"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group password-group">
                                    <label>Confirmar Contraseña <span>*</span></label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Repite la contraseña"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="fandom-submit-btn" disabled={loading || !token}>
                                    {loading ? 'Guardando...' : 'GUARDAR CONTRASEÑA'}
                                </button>
                            </form>

                            <div className="auth-switch">
                                <p><button type="button" onClick={() => navigate('/auth')}>Volver al login</button></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
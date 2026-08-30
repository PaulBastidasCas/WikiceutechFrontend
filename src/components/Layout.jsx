import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, Home as HomeIcon, LogOut, Star, User, PlusCircle, Shield, LogIn } from 'lucide-react';
import '../styles/Home.css';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.rol ? payload.rol.toUpperCase() : 'USER');
            } catch (e) {
                setUserRole('USER');
            }
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserRole(null);
        navigate('/home');
    };

    return (
        <div className="wiki-container">
            <aside className="wiki-sidebar">
                <div className="sidebar-logo">
                    <div className="honduras-stars-logo">
                        <div className="star-row top">
                            <Star size={8} fill="#00bce4" color="#00bce4" />
                            <Star size={8} fill="#00bce4" color="#00bce4" />
                        </div>
                        <div className="star-row middle">
                            <Star size={8} fill="#00bce4" color="#00bce4" />
                        </div>
                        <div className="star-row bottom">
                            <Star size={8} fill="#00bce4" color="#00bce4" />
                            <Star size={8} fill="#00bce4" color="#00bce4" />
                        </div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`} onClick={() => navigate('/home')}>
                        <HomeIcon size={22} /> <span>Inicio</span>
                    </button>

                    {(userRole === 'EDITOR' || userRole === 'CREATOR') && (
                        <button className={`nav-item ${location.pathname === '/crear-articulo' ? 'active' : ''}`} onClick={() => alert('Crear artículo')}>
                            <PlusCircle size={22} /> <span>Crear Artículo</span>
                        </button>
                    )}

                    {(userRole === 'ADMIN' || userRole === 'ADMINISTRADOR') && (
                        <button className={`nav-item ${location.pathname === '/usuarios' ? 'active' : ''}`} onClick={() => alert('Ver Usuarios')}>
                            <Shield size={22} /> <span>Ver Usuarios</span>
                        </button>
                    )}

                    {userRole && (
                        <button className={`nav-item ${location.pathname === '/perfil' ? 'active' : ''}`} onClick={() => alert('Ir al perfil')}>
                            <User size={22} /> <span>Perfil</span>
                        </button>
                    )}
                </nav>
            </aside>

            <main className="wiki-main">
                <header className="wiki-topbar">
                    <div className="topbar-brand">
                        <h2>HnWiki</h2>
                    </div>
                    <div className="topbar-search">
                        <Search className="search-icon" size={18} />
                        <input type="text" placeholder="Buscar en la enciclopedia libre..." />
                    </div>
                    <div className="topbar-actions">
                        {!userRole ? (
                            <button className="action-btn login" onClick={() => navigate('/auth')}>
                                <LogIn size={16} /> Iniciar Sesión
                            </button>
                        ) : (
                            <button className="action-btn login" onClick={handleLogout}>
                                <LogOut size={16} /> Cerrar Sesión
                            </button>
                        )}
                    </div>
                </header>

                {/* CONTENIDO CENTRAL */}
                <Outlet />
            </main>
        </div>
    );
}
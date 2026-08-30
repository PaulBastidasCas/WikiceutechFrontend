// src/javascript/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Camera, Key } from 'lucide-react';
import api from '../services/api';
import '../styles/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    api.get('/users/me')
      .then(res => setUser(res.data))
      .catch(err => console.error("Error cargando perfil", err));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMsg({ text: 'Subiendo imagen...', type: 'info' });
    
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUser(response.data);
      setMsg({ text: 'Foto de perfil actualizada.', type: 'success' });
    } catch (error) {
      setMsg({ text: 'Error al actualizar la foto.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = () => {
    localStorage.removeItem('token');
    navigate('/auth', { state: { view: 'recover', email: user.email } });
  };

  if (!user) return <div className="profile-container"><p>Cargando perfil...</p></div>;

  const roleName = user.role?.name || 'USER';

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-wrapper">
            <img 
              src={user.profilePictureUrl || "https://res.cloudinary.com/bejcylzm/image/upload/v1/default-avatar.png"} 
              alt="Avatar" 
              className="profile-avatar" 
            />
            <label className="avatar-upload-btn" htmlFor="avatar-upload">
              <Camera size={18} />
            </label>
            <input 
              type="file" 
              id="avatar-upload" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={loading}
              style={{ display: 'none' }} 
            />
          </div>
          <h2>{user.userName}</h2>
          <span className="profile-role-badge">{roleName}</span>
        </div>

        {msg.text && (
          <div className={`profile-msg ${msg.type}`}>{msg.text}</div>
        )}

        <div className="profile-details">
          <div className="detail-item">
            <User className="detail-icon" size={20} />
            <div className="detail-text">
              <strong>Nombre de Usuario</strong>
              <span>{user.userName}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <Mail className="detail-icon" size={20} />
            <div className="detail-text">
              <strong>Correo Electrónico</strong>
              <span>{user.email}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <Shield className="detail-icon" size={20} />
            <div className="detail-text">
              <strong>Rol en la Wiki</strong>
              <span>{roleName}</span>
            </div>
          </div>

          <div className="detail-item">
            <Calendar className="detail-icon" size={20} />
            <div className="detail-text">
              <strong>Miembro desde</strong>
              <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="reset-pwd-btn" onClick={handlePasswordReset}>
            <Key size={18} /> Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
}
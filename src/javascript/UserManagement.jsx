import { useState, useEffect } from 'react';
import { Shield, UserCheck, UserX, Key, Check } from 'lucide-react';
import api from '../services/api';
import '../styles/UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get('/users/all')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error cargando usuarios", err));
  };

  const handleRoleChange = async (userId, roleId) => {
    try {
      await api.put(`/users/${userId}/role`, { roleId: Number(roleId) });
      setMsg({ text: 'Rol actualizado exitosamente.', type: 'success' });
      fetchUsers();
    } catch (err) {
      setMsg({ text: 'Error al actualizar el rol.', type: 'error' });
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      await api.put(`/users/${userId}/status`, { isActive: !currentStatus });
      setMsg({ text: 'Estado del usuario actualizado.', type: 'success' });
      fetchUsers();
    } catch (err) {
      setMsg({ text: 'Error al cambiar el estado.', type: 'error' });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;

    try {
      await api.put(`/users/${selectedUser.id}/password`, { newPassword });
      setMsg({ text: `Contraseña actualizada para ${selectedUser.userName}`, type: 'success' });
      setSelectedUser(null);
      setNewPassword('');
    } catch (err) {
      setMsg({ text: 'Error al cambiar la contraseña.', type: 'error' });
    }
  };

  return (
    <div className="management-container">
      <div className="management-card">
        <div className="management-header">
          <h2><Shield size={24} /> Panel de Gestión de Usuarios</h2>
          <p>Administra los roles, estados y accesos de los miembros de la plataforma.</p>
        </div>

        {msg.text && (
          <div className={`management-msg ${msg.type}`}>{msg.text}</div>
        )}

        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="user-info-cell">
                   <img src={u.profilePictureUrl || `https://ui-avatars.com/api/?name=${u.userName}&background=00BCE4&color=fff`} alt="Avatar" />
                    <span>{u.userName}</span>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select 
                      value={u.role?.id || 1} 
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="role-select"
                    >
                      <option value={1}>USER</option>
                      <option value={2}>ADMIN</option>
                      <option value={3}>EDITOR</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className={`action-icon-btn ${u.isActive ? 'deactivate' : 'activate'}`}
                      onClick={() => handleStatusChange(u.id, u.isActive)}
                      title={u.isActive ? "Desactivar usuario" : "Activar usuario"}
                    >
                      {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                    <button 
                      className="action-icon-btn password"
                      onClick={() => setSelectedUser(u)}
                      title="Cambiar contraseña"
                    >
                      <Key size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cambiar contraseña a {selectedUser.userName}</h3>
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input 
                  type="password" 
                  placeholder="Escribe la nueva contraseña" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setSelectedUser(null)}>Cancelar</button>
                <button type="submit" className="save-btn"><Check size={16} /> Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Hubo un error al cargar los usuarios. Por favor, intenta de nuevo más tarde.');
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {users.map(user => (
          <div key={user.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={user.avatar || 'ruta_imagen_por_defecto.jpg'}
                alt="Avatar"
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">Correo: {user.email}</p>
                <p className="card-text">Rol: {user.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersList;

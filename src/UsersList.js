import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { alertaSuccess, alertaError } from './Alertas';
function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState('');

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

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleShowEditModal = (userId, userName, userEmail, userRole) => {
    setEditUserId(userId);
    setEditUserName(userName);
    setEditUserEmail(userEmail);
    setEditUserRole(userRole);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleSubmitCreateUser = async (e) => {
    e.preventDefault();
    try {
      // creación de usuario
      const newUser = {
        id: Math.random().toString(),
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
      };
      setUsers([...users, newUser]);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole('');
      alertaSuccess('Usuario creado exitosamente.');
      handleCloseAddModal();
    } catch (error) {
      console.error('Error creating user:', error);
      alertaError('Hubo un error al crear el usuario. Por favor, intenta de nuevo más tarde.');
    }
  };

  const handleSubmitEditUser = async (e) => {
    e.preventDefault();
    try {
      // edición de usuario
      const editedUser = {
        id: editUserId,
        name: editUserName,
        email: editUserEmail,
        role: editUserRole,
      };
      setUsers(users.map(user => (user.id === editUserId ? editedUser : user)));
      setEditUserId(null);
      setEditUserName('');
      setEditUserEmail('');
      setEditUserRole('');
      alertaSuccess('Usuario actualizado exitosamente.');
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating user:', error);
      alertaError('Hubo un error al actualizar el usuario. Por favor, intenta de nuevo más tarde.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // eliminación de usuario
      const remainingUsers = users.filter(user => user.id !== userId);
      setUsers(remainingUsers);
      alertaSuccess('Usuario eliminado exitosamente.');
    } catch (error) {
      console.error('Error deleting user:', error);
      alertaError('Hubo un error al eliminar el usuario. Por favor, intenta de nuevo más tarde.');
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      <Button variant="dark" onClick={handleShowAddModal}>
        <BsPencilSquare /> Agregar Usuario
      </Button>

      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCreateUser}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" placeholder="Correo electrónico" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formBasicRole">
              <Form.Label>Rol</Form.Label>
              <Form.Control type="text" placeholder="Rol" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit">Agregar</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Editar Usuario Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEditUser}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" value={editUserName} onChange={(e) => setEditUserName(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" placeholder="Correo electrónico" value={editUserEmail} onChange={(e) => setEditUserEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formBasicRole">
              <Form.Label>Rol</Form.Label>
              <Form.Control type="text" placeholder="Rol" value={editUserRole} onChange={(e) => setEditUserRole(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit">Actualizar</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <h2> </h2>
      <div className="table-responsive">
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Avatar</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td><img src={user.avatar || 'https://i.imgur.com/LDOO4Qs.jpg'} alt="Avatar" className="rounded-circle" width="50" height="50" /></td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button className="btn btn-warning mr-2" onClick={() => handleShowEditModal(user.id, user.name, user.email, user.role)}>
                <BsPencilSquare /> Editar
              </button>
              </td><td>
              <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>
                <BsTrash /> Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    </div>
  );
}

export default UsersList;


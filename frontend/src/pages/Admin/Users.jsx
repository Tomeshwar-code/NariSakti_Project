import { useEffect, useState } from 'react';
import { getAdminUsers, updateUserRole, verifySeller } from '../../services/adminServices';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [status, setStatus] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAdminUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (id, role) => {
    const selectedUser = users.find((user) => user._id === id);
    if (!selectedUser || selectedUser.role === role) return;

    try {
      setUpdatingUserId(id);
      setStatus('');
      const res = await updateUserRole(id, role);
      const updatedUser = res.data.user;
      setUsers((prevUsers) => prevUsers.map((user) => (
        user._id === id ? updatedUser : user
      )));
      setStatus(`${updatedUser.firstName} ${updatedUser.lastName} role changed to ${updatedUser.role}`);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Unable to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleVerifySeller = async (id, approve) => {
    try {
      await verifySeller(id, approve);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Users</h2>
      {status && <p>{status}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isCurrentAdmin = String(u._id) === String(currentUserId);

            return (
              <tr key={u._id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(event) => handleRoleChange(u._id, event.target.value)}
                    disabled={updatingUserId === u._id || isCurrentAdmin}
                  >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                  {isCurrentAdmin && <span style={{ marginLeft: 8, color: '#777' }}>Current admin</span>}
                </td>
                <td>
                  {u.role === 'seller' && (
                    <>
                      <button onClick={() => handleVerifySeller(u._id, true)}>Verify</button>
                      <button onClick={() => handleVerifySeller(u._id, false)}>Unverify</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Users;

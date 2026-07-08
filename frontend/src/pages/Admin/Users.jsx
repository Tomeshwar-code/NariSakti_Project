import React, { useEffect, useState } from 'react';
import { getAdminUsers, verifySeller } from '../../services/adminServices';

const Users = () => {
  const [users, setUsers] = useState([]);

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
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role === 'seller' && (
                  <>
                    <button onClick={() => handleVerifySeller(u._id, true)}>Verify</button>
                    <button onClick={() => handleVerifySeller(u._id, false)}>Unverify</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;

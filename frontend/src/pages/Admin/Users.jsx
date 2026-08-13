// import { useEffect, useState } from 'react';
// import { getAdminUsers, updateUserRole, verifySeller } from '../../services/adminServices';

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [updatingUserId, setUpdatingUserId] = useState(null);
//   const [status, setStatus] = useState('');
//   const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
//   const currentUserId = currentUser?._id || currentUser?.id;

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await getAdminUsers();
//       setUsers(res.data.users || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRoleChange = async (id, role) => {
//     const selectedUser = users.find((user) => user._id === id);
//     if (!selectedUser || selectedUser.role === role) return;

//     try {
//       setUpdatingUserId(id);
//       setStatus('');
//       const res = await updateUserRole(id, role);
//       const updatedUser = res.data.user;
//       setUsers((prevUsers) => prevUsers.map((user) => (
//         user._id === id ? updatedUser : user
//       )));
//       setStatus(`${updatedUser.firstName} ${updatedUser.lastName} role changed to ${updatedUser.role}`);
//     } catch (err) {
//       setStatus(err.response?.data?.message || 'Unable to update user role');
//     } finally {
//       setUpdatingUserId(null);
//     }
//   };

//   const handleVerifySeller = async (id, approve) => {
//     try {
//       await verifySeller(id, approve);
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Users</h2>
//       {status && <p>{status}</p>}
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Change Role</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u) => {
//             const isCurrentAdmin = String(u._id) === String(currentUserId);

//             return (
//               <tr key={u._id}>
//                 <td>{u.firstName} {u.lastName}</td>
//                 <td>{u.email}</td>
//                 <td>{u.role}</td>
//                 <td>
//                   <select
//                     value={u.role}
//                     onChange={(event) => handleRoleChange(u._id, event.target.value)}
//                     disabled={updatingUserId === u._id || isCurrentAdmin}
//                   >
//                     <option value="user">User</option>
//                     <option value="seller">Seller</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                   {isCurrentAdmin && <span style={{ marginLeft: 8, color: '#777' }}>Current admin</span>}
//                 </td>
//                 <td>
//                   {u.role === 'seller' && (
//                     <>
//                       <button onClick={() => handleVerifySeller(u._id, true)}>Verify</button>
//                       <button onClick={() => handleVerifySeller(u._id, false)}>Unverify</button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Users;
// AdminUsers.jsx
import { useEffect, useState, useMemo } from 'react';
import { getAdminUsers, updateUserRole, verifySeller } from '../../services/adminServices';
import './Users.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [modalData, setModalData] = useState(null); // { userId, newRole }
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState(null); // { userId, approve }

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter, sort, and search
  useEffect(() => {
    let result = [...users];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(term) ||
          u.lastName?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u._id?.toLowerCase().includes(term)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter);
    }

    // Verification filter (for sellers)
    if (verificationFilter !== 'all') {
      if (verificationFilter === 'verified') {
        result = result.filter((u) => u.role === 'seller' && u.isVerified === true);
      } else if (verificationFilter === 'unverified') {
        result = result.filter((u) => u.role === 'seller' && u.isVerified === false);
      } else if (verificationFilter === 'non-seller') {
        result = result.filter((u) => u.role !== 'seller');
      }
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name':
        result.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      case 'email':
        result.sort((a, b) => a.email.localeCompare(b.email));
        break;
      default:
        break;
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchTerm, roleFilter, verificationFilter, sortBy]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    const selectedUser = users.find((u) => u._id === userId);
    if (!selectedUser || selectedUser.role === newRole) return;
    if (String(userId) === String(currentUserId)) {
      setStatus({ message: 'You cannot change your own role.', type: 'error' });
      return;
    }
    setModalData({ userId, newRole });
    setShowRoleModal(true);
  };

  const confirmRoleChange = async () => {
    if (!modalData) return;
    const { userId, newRole } = modalData;
    setUpdatingUserId(userId);
    setShowRoleModal(false);
    try {
      const res = await updateUserRole(userId, newRole);
      const updatedUser = res.data.user;
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
      setStatus({
        message: `${updatedUser.firstName} ${updatedUser.lastName} role changed to ${updatedUser.role}`,
        type: 'success',
      });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || 'Unable to update user role',
        type: 'error',
      });
    } finally {
      setUpdatingUserId(null);
      setModalData(null);
    }
  };

  const handleVerifySeller = (userId, approve) => {
    setVerifyData({ userId, approve });
    setShowVerifyModal(true);
  };

  const confirmVerify = async () => {
    if (!verifyData) return;
    const { userId, approve } = verifyData;
    setShowVerifyModal(false);
    try {
      await verifySeller(userId, approve);
      await fetchUsers();
      const action = approve ? 'verified' : 'unverified';
      setStatus({
        message: `Seller ${action} successfully.`,
        type: 'success',
      });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || `Failed to ${approve ? 'verify' : 'unverify'} seller.`,
        type: 'error',
      });
    } finally {
      setVerifyData(null);
    }
  };

  const cancelModal = () => {
    setShowRoleModal(false);
    setShowVerifyModal(false);
    setModalData(null);
    setVerifyData(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-admin';
      case 'seller':
        return 'role-seller';
      case 'user':
      default:
        return 'role-user';
    }
  };

  const getStatusBadgeClass = (isVerified) => {
    return isVerified ? 'badge-verified' : 'badge-unverified';
  };

  // Stats
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const sellers = users.filter((u) => u.role === 'seller').length;
    const verifiedSellers = users.filter((u) => u.role === 'seller' && u.isVerified).length;
    const unverifiedSellers = sellers - verifiedSellers;
    return { total, admins, sellers, verifiedSellers, unverifiedSellers };
  }, [users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="admin-users-loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={fetchUsers} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h2>👥 User Management</h2>
        <button onClick={fetchUsers} className="refresh-btn" title="Refresh users">
          🔄
        </button>
      </div>

      {/* Status message */}
      {status.message && (
        <div className={`status-message status-${status.type}`}>
          {status.message}
          <button className="status-close" onClick={() => setStatus({ message: '', type: '' })}>
            ✕
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">👤</span>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card stat-admin">
          <span className="stat-icon">🛡️</span>
          <div>
            <div className="stat-value">{stats.admins}</div>
            <div className="stat-label">Admins</div>
          </div>
        </div>
        <div className="stat-card stat-seller">
          <span className="stat-icon">🏪</span>
          <div>
            <div className="stat-value">{stats.sellers}</div>
            <div className="stat-label">Sellers</div>
          </div>
        </div>
        <div className="stat-card stat-verified">
          <span className="stat-icon">✅</span>
          <div>
            <div className="stat-value">{stats.verifiedSellers}</div>
            <div className="stat-label">Verified Sellers</div>
          </div>
        </div>
        <div className="stat-card stat-unverified">
          <span className="stat-icon">⏳</span>
          <div>
            <div className="stat-value">{stats.unverifiedSellers}</div>
            <div className="stat-label">Unverified Sellers</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="user">User</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified Sellers</option>
            <option value="unverified">Unverified Sellers</option>
            <option value="non-seller">Non-Sellers</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Alphabetical</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      {/* Results info */}
      <div className="results-info">
        <span>
          Showing {paginatedUsers.length} of {filteredUsers.length} user
          {filteredUsers.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Users Table */}
      {paginatedUsers.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No users found</p>
          <span className="empty-sub">
            {searchTerm || roleFilter !== 'all' || verificationFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Users will appear here once they register'}
          </span>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Seller Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => {
                const isCurrentUser = String(user._id) === String(currentUserId);
                const isSeller = user.role === 'seller';
                const isVerified = user.isVerified === true;

                return (
                  <tr key={user._id} className={isCurrentUser ? 'current-user-row' : ''}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <div className="user-name">
                            {user.firstName} {user.lastName}
                            {isCurrentUser && (
                              <span className="current-user-badge">(You)</span>
                            )}
                          </div>
                          <div className="user-id">ID: {user._id?.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      {isSeller ? (
                        <span className={`status-badge ${getStatusBadgeClass(isVerified)}`}>
                          {isVerified ? '✅ Verified' : '⏳ Pending'}
                        </span>
                      ) : (
                        <span className="status-badge badge-na">—</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {/* Role change dropdown */}
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={updatingUserId === user._id || isCurrentUser}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>

                        {/* Seller verification buttons */}
                        {isSeller && (
                          <>
                            <button
                              onClick={() => handleVerifySeller(user._id, true)}
                              disabled={isVerified || updatingUserId === user._id}
                              className="btn-verify"
                              title="Verify seller"
                            >
                              ✅
                            </button>
                            <button
                              onClick={() => handleVerifySeller(user._id, false)}
                              disabled={!isVerified || updatingUserId === user._id}
                              className="btn-unverify"
                              title="Unverify seller"
                            >
                              🚫
                            </button>
                          </>
                        )}

                        {updatingUserId === user._id && (
                          <span className="updating-spinner">⏳</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ◀ Prev
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next ▶
          </button>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && modalData && (
        <div className="modal-overlay" onClick={cancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Change Role</h3>
            <p>
              Are you sure you want to change this user's role to{' '}
              <strong>{modalData.newRole.charAt(0).toUpperCase() + modalData.newRole.slice(1)}</strong>?
            </p>
            <div className="modal-actions">
              <button onClick={cancelModal} className="modal-btn modal-cancel">
                Cancel
              </button>
              <button onClick={confirmRoleChange} className="modal-btn modal-confirm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerifyModal && verifyData && (
        <div className="modal-overlay" onClick={cancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{verifyData.approve ? 'Verify Seller' : 'Unverify Seller'}</h3>
            <p>
              Are you sure you want to{' '}
              <strong>{verifyData.approve ? 'verify' : 'unverify'}</strong> this seller?
            </p>
            <div className="modal-actions">
              <button onClick={cancelModal} className="modal-btn modal-cancel">
                Cancel
              </button>
              <button
                onClick={confirmVerify}
                className={`modal-btn ${verifyData.approve ? 'modal-confirm-approve' : 'modal-confirm-reject'}`}
              >
                {verifyData.approve ? 'Verify' : 'Unverify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
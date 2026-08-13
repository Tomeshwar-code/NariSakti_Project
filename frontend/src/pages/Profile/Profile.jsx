// import { useEffect, useState } from 'react';
// import { getMe } from '../../services/authServices';
// import WalletWidget from '../../components/common/WalletWidget';
// import WhatsAppWidget from '../../components/common/WhatsAppWidget';

// function Profile() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const data = await getMe();
//       setUser(data.user);
//     } catch (error) {
//       console.error(error.response?.data || error);
//     }
//   };

//   if (!user) {
//     return <h2>Loading...</h2>;
//   }

//   return (
//     <div className="profile-page profile-page--grid">
//       <div className="profile-card glass-panel">
//         <h2>My Profile</h2>
//         <p>
//           Name: {user.firstName} {user.lastName}
//         </p>
//         <p>Email: {user.email}</p>
//         <p>Phone: {user.phone}</p>
//         <p>Role: {user.role}</p>
//         <div className="profile-actions" style={{ marginTop: 20 }}>
//           <a href="/profile/edit" className="btn btn-ghost">Edit Profile</a>
//           <a href="/profile/change-password" className="btn btn-ghost">Change Password</a>
//         </div>
//       </div>

//       <div className="profile-sidebar">
//         <WalletWidget />
//         <WhatsAppWidget />
//       </div>
//     </div>
//   );
// }

// export default Profile;
import { useEffect, useState } from 'react';
import { getMe } from '../../services/authServices';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="skeleton-card"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <span>⚠️</span>
        <p>Could not load profile</p>
        <button onClick={fetchProfile}>Retry</button>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="profile-wrapper">
      <div className="profile-grid">
        {/* Left Column – Profile Card */}
        <div className="profile-card">
          <div className="card-cover">
            <div className="avatar-container">
              <div className="avatar">
                {initials || 'U'}
              </div>
              <div className="online-dot"></div>
            </div>
          </div>
          <div className="card-body">
            <h2>{user.firstName} {user.lastName}</h2>
            <p className="user-email">{user.email}</p>
            <span className="user-role">{user.role || 'Member'}</span>

            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">₹0</span>
                <span className="stat-label">Spent</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Wishlist</span>
              </div>
            </div>

            <div className="card-actions">
              <a href="/profile/edit" className="btn-primary">Edit Profile</a>
              <a href="/profile/change-password" className="btn-outline">Change Password</a>
            </div>
          </div>
        </div>

        {/* Right Column – Activity & Links */}
        <div className="profile-sidebar">
          <div className="info-card">
            <h4>📱 Contact</h4>
            <p><strong>Phone</strong> {user.phone || 'Not added'}</p>
            <p><strong>Address</strong> {user.address?.street ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}` : 'Not added'}</p>
          </div>

          <div className="info-card">
            <h4>🔗 Quick Actions</h4>
            <ul className="link-list">
              <li><a href="/orders">📦 My Orders</a></li>
              <li><a href="/wishlist">❤️ Wishlist</a></li>
              <li><a href="/support">🆘 Support</a></li>
              <li><a href="/logout">🚪 Logout</a></li>
            </ul>
          </div>

          <div className="info-card">
            <h4>📊 Account Info</h4>
            <p><strong>Member since</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}</p>
            <p><strong>Last active</strong> Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
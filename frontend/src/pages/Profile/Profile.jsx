import { useEffect, useState } from 'react';
import { getMe } from '../../services/authServices';
import WalletWidget from '../../components/common/WalletWidget';
import WhatsAppWidget from '../../components/common/WhatsAppWidget';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="profile-page profile-page--grid">
      <div className="profile-card glass-panel">
        <h2>My Profile</h2>
        <p>
          Name: {user.firstName} {user.lastName}
        </p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Role: {user.role}</p>
        <div className="profile-actions" style={{ marginTop: 20 }}>
          <a href="/profile/edit" className="btn btn-ghost">Edit Profile</a>
          <a href="/profile/change-password" className="btn btn-ghost">Change Password</a>
        </div>
      </div>

      <div className="profile-sidebar">
        <WalletWidget />
        <WhatsAppWidget />
      </div>
    </div>
  );
}

export default Profile;

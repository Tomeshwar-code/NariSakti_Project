import React, { useEffect, useState } from 'react';
import { getMe } from '../../services/authServices';

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
      console.log(error.response?.data);
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <p>
        Name: {user.firstName} {user.lastName}
      </p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Role: {user.role}</p>
      <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href="/profile/edit">Edit Profile</a>
        <a href="/profile/change-password">Change Password</a>
      </div>
    </div>
  );
}

export default Profile;
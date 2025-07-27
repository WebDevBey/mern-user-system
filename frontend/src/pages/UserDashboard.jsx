import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const UserDashboard = () => {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth?.accessToken) return;
      try {
        const res = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
          withCredentials: true,
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Failed to fetch user profile.");
      }
    };
    fetchProfile();
  }, [auth]);

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {profile && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Profile Information</h3>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

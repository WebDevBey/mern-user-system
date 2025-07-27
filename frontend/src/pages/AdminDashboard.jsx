import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!auth?.accessToken) return;
      try {
        const res = await axios.get(`/api/users?page=${page}&limit=2`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        });
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError("Failed to fetch users.");
      }
    };
    fetchUsers();
  }, [page, auth]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });
      //   refetch users
      const res = await axios.get(`/api/users?page=${page}&limit=2`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });

      if (res.data.users.length === 0 && page > 1) {
        setPage(page - 1); // Go back a page if the current page is empty
      } else {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h3 className="text-xl font-semibold mb-4">User Management</h3>
      <ul className="space-y-2">
        {users?.map((user) => (
          <li key={user._id}>
            <span>
              {user.username} ({user.email}) - {user.role}
            </span>
            {user.role !== "admin" && (
              <button
                onClick={() => handleDelete(user._id)}
                className="ml-4 bg-red-600 text-white p-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
      {/* Pagination buttons */}
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            className={`px-3 py-1 rounded ${
              page === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setPage(index + 1)}
            key={index}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

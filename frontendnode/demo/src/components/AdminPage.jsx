import { useEffect, useState } from 'react';
import './admin.css';

const AdminPage = () => {
  const [data, setData] = useState({ college: [], shs: [], teacher: [] });

  useEffect(() => {
    fetch('http://localhost:5000/api/participants/all')
      .then((res) => res.json())
      .then((resData) => setData(resData));
  }, []);

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      await fetch(`http://localhost:5000/api/participants/${type}/${id}`, { method: 'DELETE' });
      setData((prev) => ({
        ...prev,
        [type]: prev[type].filter((p) => p._id !== id)
      }));
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      {['college', 'shs', 'teacher'].map((type) => (
        <div key={type} className="admin-section">
          <h3>{type.toUpperCase()}</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data[type].map((p) => (
                <tr key={p._id}>
                  <td>{p.idNumber}</td>
                  <td>{p.firstName} {p.lastName}</td>
                  <td>
                    <button onClick={() => handleDelete(type, p._id)}>Delete</button>
                    {/* You can add Edit button and modal logic here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;

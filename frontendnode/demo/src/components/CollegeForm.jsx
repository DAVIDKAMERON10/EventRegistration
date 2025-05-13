import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CollegeForm = () => {
  const [formData, setFormData] = useState({
    idNumber: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    program: '',
    yearLevel: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/participants/college', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to confirmation page with participant data + QR
        navigate('/confirmation', {
          state: {
            ...formData,
            qrCode: data.qrCode,
          },
        });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Request failed: ' + err.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input type="text" name="idNumber" placeholder="ID Number" onChange={handleChange} required />
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="middleInitial" placeholder="Middle Initial" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />

        <select name="program" div className= "forms" value={formData.program} onChange={handleChange} required>
          <option value="">Select Program</option>
          <option value="BSN">BSN</option>
          <option value="BSIT">BSIT</option>
          <option value="BSED">BSED</option>
          <option value="BEED">BEED</option>
          <option value="BSTM">BSTM</option>
          <option value="BSCRIM">BSCRIM</option>
          <option value="BSCA">BSCA</option>
        </select>

        <input type="text" name="yearLevel" placeholder="Year Level (e.g., 1, 2, 3)" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CollegeForm;

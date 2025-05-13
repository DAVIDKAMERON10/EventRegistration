import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SHSForm = () => {
  const [formData, setFormData] = useState({
    idNumber: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
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
      const res = await fetch('http://localhost:5000/api/participants/Shs', {
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

      <select name="strand" div className="forms" value={formData.strand} onChange={handleChange} required>
          <option value="">Select Strand</option>
          <option value="ABM">ABM</option>
          <option value="STEM">STEM</option>
          <option value="GAS">GAS</option>
          <option value="HUMSS">HUMSS</option>
          </select>


      <select name="year" div className="forms" value={formData.year} onChange={handleChange} required>
     <option value="">Select Year</option>
      <option value="11">11</option>
      <option value="12">12</option>
      </select>
   

      <button type="submit">Register</button>

    
    </form>
    </div>
  );
};

export default SHSForm;

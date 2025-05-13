import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './confirm.css';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const participant = location.state;

  useEffect(() => {
    if (!participant) navigate('/');
  }, [participant, navigate]);

  if (!participant) return null;

  const {
    idNumber,
    firstName,
    middleInitial,
    lastName,
    qrCode,
    program,
    yearLevel,
    year,
    strand,
    section,
    department,
    type,
  } = participant;

  const fullName = middleInitial 
    ? `${firstName} ${middleInitial}. ${lastName}`
    : `${firstName} ${lastName}`;


  return (
    <div className="confirmation-container">
      <h2 className="confirmation-heading">🎉 You are now registered!</h2>

      <div className="confirmation-layout">
        {/* Card Section */}
        
        <div className="participant-card" id="card">
            <h3>{fullName}</h3>
          <img src={qrCode} alt="QR Code" className="qr-code" />
          <p className="participant-label">{type}</p>

          {/* Shared Info */}
          {idNumber && <p><strong>ID Number:</strong> {idNumber}</p>}

          {/* College-specific */}
          {program && <p><strong>Program:</strong> {program}</p>}
          {yearLevel && <p><strong>Year Level:</strong> {yearLevel}</p>}

          {/* SHS-specific */}
          {strand && <p><strong>Strand:</strong> {strand}</p>}
          {section && <p><strong>Section:</strong> {section}</p>}
          {year && <p><strong>Year Level:</strong> {year}</p>}

          {/* Teacher-specific */}
          {department && <p><strong>Department:</strong> {department}</p>}
        </div>

        {/* Print Button */}
        <div className="print-button-container no-print">
          <button onClick={() => window.print()}>🖨️ Print Card</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;

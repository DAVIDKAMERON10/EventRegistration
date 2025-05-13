import { useEffect, useState } from 'react';
import '../styles/admin.css';

const AdminPage = () => {
  const [data, setData] = useState({ college: [], shs: [], teacher: [] });
  const [view, setView] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('http://localhost:5000/api/participants/all')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      });
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

  const handlePrint = (participant) => {
    const printable = `
      ID Number: ${participant.idNumber || ''}\n
      Name: ${participant.firstName || ''} ${participant.middleInitial || ''} ${participant.lastName || ''}\n
      ${participant.program ? 'Program: ' + participant.program : ''}
      ${participant.yearLevel ? 'Year: ' + participant.yearLevel : ''}
      ${participant.year ? 'Year: ' + participant.year : ''}
      ${participant.strand ? 'Strand: ' + participant.strand : ''}
      ${participant.department ? 'Department: ' + participant.department : ''}
     
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<pre>${printable}</pre>`);
    printWindow.document.close();
    printWindow.print();
  };

  const getAllCombined = () => {
    try {
      if (!data.college || !data.shs || !data.teacher) {
        console.error("Missing data categories:", data);
        return [];
      }
      
      return [
        ...(Array.isArray(data.college) ? data.college.map(p => ({ ...p, type: 'college' })) : []),
        ...(Array.isArray(data.shs) ? data.shs.map(p => ({ ...p, type: 'shs' })) : []),
        ...(Array.isArray(data.teacher) ? data.teacher.map(p => ({ ...p, type: 'teacher' })) : []),
      ];
    } catch (err) {
      console.error("Error combining data:", err);
      setError(`Error combining data: ${err.message}`);
      return [];
    }
  };

 
  const filterParticipants = (participants) => {
    try {
      if (!searchTerm || !searchTerm.trim()) return participants;
      
      const searchLower = searchTerm.toLowerCase().trim();
      
      return participants.filter(participant => {
        try {
          if (!participant) return false;
        
          const idNumber = typeof participant.idNumber === 'string' ? participant.idNumber.toLowerCase() : '';
          const firstName = typeof participant.firstName === 'string' ? participant.firstName.toLowerCase() : '';
          const lastName = typeof participant.lastName === 'string' ? participant.lastName.toLowerCase() : '';
          const middleInitial = typeof participant.middleInitial === 'string' ? participant.middleInitial.toLowerCase() : '';
          
          return (
            idNumber.includes(searchLower) ||
            firstName.includes(searchLower) ||
            lastName.includes(searchLower) ||
            middleInitial.includes(searchLower)
          );
        } catch (err) {
          console.error("Error filtering a participant:", err, participant);
          return false; 
        }
      });
    } catch (err) {
      console.error("Error in filterParticipants:", err);
      setError(`Search error: ${err.message}`);
      return participants; 
    }
  };

 
  const paginate = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderTable = (type, entries) => {
    try {
      if (!Array.isArray(entries)) {
        console.error(`Entries for ${type} is not an array:`, entries);
        return <div className="error">Error: Invalid data format</div>;
      }
      
      const filteredEntries = filterParticipants(entries);
      const paginatedEntries = paginate(filteredEntries);
      const totalPages = Math.max(1, Math.ceil(filteredEntries.length / itemsPerPage));

     
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }

      return (
        <div key={type} className="admin-section">
          <h3>{type === 'all' ? 'All Participants' : type.toUpperCase()}</h3>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Always reset to first page when searching
              }}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.length > 0 ? (
                paginatedEntries.map((p, index) => (
                  <tr key={p._id || `${type}-${index}`}>
                    <td>{p?.idNumber || 'N/A'}</td>
                    <td>{p?.firstName || ''} {p?.lastName || ''}</td>
                    <td>
                      {p?.program && <div>Program: {p.program}</div>}
                      {p?.strand && <div>Strand: {p.strand}</div>}
                      {p?.department && <div>Dept: {p.department}</div>}
                    </td>
                    <td>
                      <button onClick={() => handlePrint(p)}>Print</button>
                      <button onClick={() => handleDelete(p.type || type, p._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    {searchTerm ? 'No matching participants found' : 'No participants available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredEntries.length > itemsPerPage && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
    } catch (err) {
      console.error(`Error rendering table for ${type}:`, err);
      setError(`Error displaying ${type} table: ${err.message}`);
      return <div className="error">Error rendering table: {err.message}</div>;
    }
  };

  const total = data.college.length + data.shs.length + data.teacher.length;

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {loading ? (
        <p>Loading participants...</p>
      ) : (
        <>
          <div className="counts">
            <strong>Total Participants:</strong> {total} | 
            <strong> College:</strong> {data.college.length} | 
            <strong> SHS:</strong> {data.shs.length} | 
            <strong> Teachers:</strong> {data.teacher.length}
          </div>

          <div className="view-buttons">
            <button 
              onClick={() => {
                setView('all');
                setCurrentPage(1);
                setSearchTerm('');
                setError(null);
              }} 
              className={view === 'all' ? 'active' : ''}
            >
              All
            </button>
            <button 
              onClick={() => {
                setView('college');
                setCurrentPage(1);
                setSearchTerm('');
                setError(null);
              }} 
              className={view === 'college' ? 'active' : ''}
            >
              College
            </button>
            <button 
              onClick={() => {
                setView('shs');
                setCurrentPage(1);
                setSearchTerm('');
                setError(null);
              }} 
              className={view === 'shs' ? 'active' : ''}
            >
              SHS
            </button>
            <button 
              onClick={() => {
                setView('teacher');
                setCurrentPage(1);
                setSearchTerm('');
                setError(null);
              }} 
              className={view === 'teacher' ? 'active' : ''}
            >
              Teacher
            </button>
          </div>

          {view === 'all' && renderTable('all', getAllCombined())}
          {view === 'college' && renderTable('college', data.college || [])}
          {view === 'shs' && renderTable('shs', data.shs || [])}
          {view === 'teacher' && renderTable('teacher', data.teacher || [])}
        </>
      )}
    </div>
  );
};

export default AdminPage;
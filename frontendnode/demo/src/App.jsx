import { useState } from 'react';
import CollegeForm from './components/CollegeForm';
import SHSForm from './components/SHSForm';
import TeacherForm from './components/TeacherForm';
import './App.css';

const App = () => {
  const [selectedType, setSelectedType] = useState('');

  return (
    <div className="app-wrapper">
      <div className="registration-container">
        <h2>Exhibition Event Registration</h2>
        <select
          className="category-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value=''>Select Category</option>
          <option value='College'>College Student</option>
          <option value='Shs'>Senior High School</option>
          <option value='Teacher'>Teacher/Faculty</option>
        </select>

        {selectedType === 'College' && <CollegeForm />}
        {selectedType === 'Shs' && <SHSForm />}
        {selectedType === 'Teacher' && <TeacherForm />}
        
      </div>
    </div>
  );
};

export default App;
;
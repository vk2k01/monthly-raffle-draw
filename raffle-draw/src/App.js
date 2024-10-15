import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import DrawPage from './components/DrawPage';

const App = () => {
  const [sequences, setSequences] = useState([]);
  const [fileName, setFileName] = useState("");
  const [monthYear, setMonthYear] = useState("");

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<UploadPage setSequences={setSequences} setFileName={setFileName} setMonthYear={setMonthYear} />} 
        />
        <Route 
          path="/raffle-draw" 
          element={<DrawPage sequences={sequences} monthYear={monthYear} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;


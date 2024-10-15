import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const UploadPage = ({ setSequences, setFileName, setMonthYear }) => {
  const [fileData, setFileData] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [numTickets, setNumTickets] = useState(0);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name); // Display file name
    setFileName(file.name); // Pass the file name up to App

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(firstSheet); // Parse Excel sheet data to JSON
      const sequencesArray = jsonData.map((row) => row.sequence).filter(Boolean); // Extract "sequence" column

      if (sequencesArray.length === 0) {
        alert("No valid sequences found in the file. Please upload a valid Excel file.");
      } else {
        setFileData({ sequences: sequencesArray }); // Save the sequences
        setSequences(sequencesArray); // Pass sequences up to App
        setNumTickets(sequencesArray.length); // Set number of tickets loaded

        // Extract month and year from the filename if it matches the pattern
        const pattern = /([a-zA-Z]+)[-_](\d{4})/;
        const match = file.name.match(pattern);
        if (match) {
          const month = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
          const year = match[2];
          setMonthYear(`${month} ${year}`); // Set month and year
        } else {
          alert("Month and year could not be extracted from the file name.");
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleProceed = () => {
    if (!fileData || fileData.sequences.length === 0) {
      alert("Please upload a valid Excel file with sequences.");
      return;
    }

    navigate("/raffle-draw");
  };


  const chooseFileButtonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#007BFF", // Blue background
    color: "white", // White text color
    border: "none", // Remove default border
    cursor: "pointer", // Pointer cursor on hover
    transition: "background-color 0.3s ease", // Smooth transition for hover effect
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Box shadow for depth
  };

  // Styles for the hidden file input
  const fileInputStyle = {
    display: "none", // Hide the default file input
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1>Upload File for Raffle Draw</h1>
        <div style={uploadContainerStyle}>
          <div style={chooseFileDivStyle}>
          <label style={chooseFileButtonStyle} htmlFor="file-input">
            Choose File
          </label>
          <input 
            type="file" 
            id="file-input" 
            accept=".xlsx, .xls" 
            onChange={handleFileUpload} 
            style={fileInputStyle} 
            multiple={false} 
          />
          <p style={{margin:"0px", fontSize:"0.9rem"}}>{uploadedFileName ? '1 File uploaded': "No file uploaded"}</p>
          </div>
          <p style={{margin:"5px", textAlign:"left", fontSize:"0.8rem", color:"#767171"}}>{uploadedFileName ? `Uploaded File: ${uploadedFileName}`:''}</p>
          <p style={{color:"#4a90e2", textAlign:"left", marginLeft:"5px",fontSize:"0.8rem"}}><strong>Note:</strong> Upload an Excel file with a column named <strong>"sequence"</strong>. <br/>File name should contain Month_Year or Month-Year.<br/><strong>example: R_October_2024.xlsx or R-October-2024.xlsx</strong></p>
          
          <p style={{marginTop:"40px"}}>{numTickets > 0 ? `${numTickets} tickets loaded` : "No tickets loaded"}</p>
        </div>
        <button
          onClick={handleProceed}
          disabled={!fileData}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            backgroundColor: fileData ? "#4CAF50" : "#ccc",
            color: fileData ? "white" : "#666",
            cursor: fileData ? "pointer" : "not-allowed",
            boxShadow: fileData ? "0 2px 5px rgba(0, 0, 0, 0.2)" : "none",
            transition: "background-color 0.3s ease",
            border:"none"
          }}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f0f0f0",
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
  textAlign: "center",
};

const uploadContainerStyle = {
  margin: "40px 0px 10px",
};

const chooseFileDivStyle = {
  display:"flex",
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"5px 5px",
  border:"1px solid lightgray",
  borderRadius:"5px"

};

export default UploadPage;

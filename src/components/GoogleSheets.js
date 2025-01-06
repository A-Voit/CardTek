import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GoogleSheets.css';  // Assuming you have a separate CSS file for styling

function GoogleSheets() {
  const navigate = useNavigate();

  // Access the Google Sheets ID from the environment variable
  const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID;

  // Log the Google Sheets ID to the console
  console.log("Google Sheets ID:", sheetId);

  return (
    <div className="google-sheets-container">
      <div className="google-sheets-content">
        <h1 className="title">Google Sheets Stats</h1>
        <button className="back-button" onClick={() => navigate('/')}>
          Go Back to Home
        </button>

        <div className="sheet-iframe">
          {/* Embed the Google Sheets document using the sheet ID */}
          <iframe 
            src={`https://docs.google.com/spreadsheets/d/e/${sheetId}/pubhtml`} 
            width="100%" 
            height="600"
            frameBorder="0"
            title="Google Sheets Document"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default GoogleSheets;
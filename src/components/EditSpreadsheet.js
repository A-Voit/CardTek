import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleSheetsEditor = () => {
  const navigate = useNavigate();
  const [spreadsheetData, setSpreadsheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const SPREADSHEET_ID = process.env.REACT_APP_FILTER_GOOGLE_SHEET_ID; // Replace with your Google Sheet ID
  const RANGE = 'Football!A1:D10';  // Range of cells to read/write

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // If the user is not authenticated, redirect to login
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
      fetchSpreadsheetData(token);
    }
  }, [navigate]);

  const fetchSpreadsheetData = async (token) => {
    setLoading(true);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const data = await response.json();
    setSpreadsheetData(data.values);
    setLoading(false);
  };

  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedData = [...spreadsheetData];
    updatedData[rowIndex][colIndex] = value;

    setSpreadsheetData(updatedData);  // Update state with new data
    updateSpreadsheetData(updatedData); // Send updated data to Google Sheets
  };

  const handleCheckboxChange = (rowIndex, colIndex) => {
    const updatedData = [...spreadsheetData];
    updatedData[rowIndex][colIndex] = updatedData[rowIndex][colIndex] === 'TRUE' ? 'FALSE' : 'TRUE';
    
    setSpreadsheetData(updatedData);  // Update state with new data
    updateSpreadsheetData(updatedData); // Send updated data to Google Sheets
  };

  const updateSpreadsheetData = async (newData) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setLoading(true);
    const body = {
      range: RANGE,
      values: newData,
    };

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log('Updated Data:', data);
    setLoading(false);
  };

  if (!isAuthenticated) return <div>Loading...</div>;

  return (
    <div>
      <h1>Google Sheets Editor</h1>
      {loading ? <p>Loading...</p> : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
                <th>Column 4</th>
              </tr>
            </thead>
            <tbody>
              {spreadsheetData?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      {/* If the value is TRUE or FALSE, show a checkbox */}
                      {cell === 'TRUE' || cell === 'FALSE' ? (
                        <input
                          type="checkbox"
                          checked={cell === 'TRUE'}
                          onChange={() => handleCheckboxChange(rowIndex, colIndex)}
                        />
                      ) : (
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GoogleSheetsEditor;

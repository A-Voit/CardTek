import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
} from '@mui/material';

const DisplayCollection = () => {
  const [sheetData, setSheetData] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRow, setNewRow] = useState(new Array(5).fill('')); // Initialize with one empty row of size 5 (assuming 5 columns)
  const SPREADSHEET_ID = process.env.REACT_APP_FILTER_GOOGLE_SHEET_ID;
  const RANGE = process.env.REACT_APP_GOOGLE_FOOTBALL_SHEET_NAME;

  useEffect(() => {
    const fetchSheetData = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setError('No access token found. Please log in again.');
        return;
      }

      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data from Google Sheets.');
        }

        const data = await response.json();
        setSheetData(data.values || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSheetData();
  }, [SPREADSHEET_ID, RANGE]);

  const handleOpenModal = () => {
    setNewRow(new Array(sheetData[0]?.length).fill('')); // Initialize with empty row based on column count
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (columnIndex, value) => {
    const updatedRow = [...newRow];
    updatedRow[columnIndex] = value;
    setNewRow(updatedRow);
  };

  const handleAddRow = async () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      setError('No access token found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}:append?valueInputOption=RAW`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [newRow],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add row to Google Sheets.');
      }

      setSheetData((prevData) => [...prevData, newRow]); // Update local state with the new row
      setNewRow(new Array(sheetData[0]?.length).fill('')); // Reset the row for the next input
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Google Sheets Data</h1>
      {sheetData.length > 0 ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ marginBottom: 2 }}
          >
            Add Row
          </Button>
          <TableContainer
            component={Paper}
            sx={{ marginTop: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                  {sheetData[0].map((header, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        textAlign: 'center',
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sheetData.slice(1).map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                      '&:hover': { backgroundColor: '#e3f2fd' },
                    }}
                  >
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        sx={{
                          textAlign: 'center',
                          fontSize: '14px',
                          padding: '10px',
                        }}
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Modal for Adding a Row */}
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="add-row-modal-title"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <h2 id="add-row-modal-title">Add Row</h2>
              {sheetData[0]?.map((header, columnIndex) => (
                <TextField
                  key={columnIndex}
                  label={header}
                  variant="outlined"
                  fullWidth
                  value={newRow[columnIndex]}
                  onChange={(e) =>
                    handleInputChange(columnIndex, e.target.value)
                  }
                  sx={{ marginBottom: 2 }}
                />
              ))}
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleAddRow}
                sx={{ marginBottom: 2 }}
              >
                Add Row
              </Button>
            </Box>
          </Modal>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default DisplayCollection;

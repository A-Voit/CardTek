import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import '../styles/CardFilter.css'; // Import external CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SPREADSHEET_ID = process.env.REACT_APP_FILTER_GOOGLE_SHEET_ID;
const RANGE = process.env.REACT_APP_GOOGLE_FOOTBALL_SHEET_NAME;
const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}`;

const CardFilter = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const excludeTextFilterColumns = ['Position', 'Rookie?', 'Auto?', 'Non NFL'];
  
  const navigate = useNavigate();  // Declare navigate

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
      fetchSpreadsheetData(token);
  
      // Check if filters are saved in localStorage
      const savedFilters = localStorage.getItem('cardFilters');
      if (savedFilters) {
        setFilters(JSON.parse(savedFilters)); // Restore the filters
      }
    }
  }, [navigate]);

  const fetchSpreadsheetData = async (token) => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.values) {
        const rows = data.values;
        const header = rows[0];
        const body = rows.slice(1);

        const formattedData = body.map((row, index) => ({
          id: index,
          ...row.reduce((acc, curr, i) => {
            acc[header[i]] = curr;
            return acc;
          }, {}),
        }));

        setData(formattedData);
        setOriginalData(formattedData);
        setColumns(header);

        const initialFilters = header.reduce((acc, col) => {
          acc[col] = { text: '', dropdown: '' };
          return acc;
        }, {});
        setFilters(initialFilters);
      } else {
        console.error('Error: No data available.');
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: React.useMemo(() => columns.map((header) => ({
      Header: header,
      accessor: header,
    })), [columns]),
    data,
  });

  const handleFilterChange = (column, type, value) => {
    const updatedFilters = { 
      ...filters, 
      [column]: { 
        ...filters[column], 
        [type]: value 
      } 
    };
    
    setFilters(updatedFilters);
  
    // Save filters to localStorage, including dropdown and text filters
    localStorage.setItem('cardFilters', JSON.stringify(updatedFilters));
  
    const filteredData = originalData.filter((row) => {
      const textMatch = updatedFilters[column].text
        ? row[column].toLowerCase().includes(updatedFilters[column].text.toLowerCase())
        : true;
  
      const dataExistsMatch = (updatedFilters[column].text === '' && row[column].length > 0);
  
      const dropdownMatch = updatedFilters[column].dropdown
        ? row[column] === updatedFilters[column].dropdown
        : true;
  
      return (textMatch || dataExistsMatch) && dropdownMatch;
    });
  
    setData(filteredData);
  };

  const clearFilters = () => {
    setData(originalData);
    setFilters(columns.reduce((acc, col) => {
      acc[col] = { text: '', dropdown: '' };
      return acc;
    }, {}));
  
    // Clear filters from localStorage
    localStorage.removeItem('cardFilters');
  };

  const updateCell = async (column, rowIndex, newValue) => {
    const columnLetter = columnToLetter(columns.indexOf(column));
    const range = `${columnLetter}${rowIndex + 2}`;
  
    const body = {
      values: [[newValue]],
    };
  
    const accessToken = localStorage.getItem('auth_token');
    
    if (!accessToken) {
      console.error('No access token found. User may not be authenticated.');
      return;
    }
  
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update cell: ${errorText}`);
      }
  
      const result = await response.json();
      console.log('Cell updated:', result);
  
      // Reload the page after successful update
      window.location.reload();
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  };
  
  function columnToLetter(col) {
    let letter = '';
    while (col >= 0) {
      letter = String.fromCharCode((col % 26) + 65) + letter;
      col = Math.floor(col / 26) - 1;
    }
    return letter;
  }

  return (
    <div className="card-filter-container">
      <div className="table-container">
        <h2 className="table-title">Card Database</h2>
        <div className="table-wrapper">
          <button className="clear-button" onClick={clearFilters}>Clear Filters</button>
          <table {...getTableProps()} className="styled-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()} className="table-header">
                      {column.render('Header')}
                      <input
                        type="text"
                        placeholder="Filter by text"
                        value={filters[column.id]?.text || ''}
                        onChange={(e) => handleFilterChange(column.id, 'text', e.target.value)}
                        className={`filter-input ${excludeTextFilterColumns.includes(column.id) ? 'invisible-textbox' : ''}`}
                      />
                      <select
                        value={filters[column.id]?.dropdown || ''}  // Set the selected value from the filter state
                        onChange={(e) => handleFilterChange(column.id, 'dropdown', e.target.value)}  // Handle change
                        className="filter-dropdown"
                      >
                        <option value="">Select {column.render('Header')}</option>
                        {/* Populate dropdown with unique column values */}
                        {[...new Set(originalData.map(row => row[column.id]))].map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="table-row">
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="table-cell">
                        <span onClick={() => updateCell(cell.column.id, row.index, prompt('Edit Value:', cell.value))}>
                          {cell.render('Cell')}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CardFilter;

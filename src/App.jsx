import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

function App() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([
    { Fruits: ['Apple', 'Orange'], Quantity: ['5'], Price: ['10'] },
    { Fruits: ['Banana'], Quantity: ['10'], Price: ['20'] },
  ]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('string');
  const [filter, setFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('>='); // Sorting options (>= or <=)

  // Add a new column
  const addColumn = () => {
    if (newColumnName && !columns.some(col => col.name === newColumnName)) {
      setColumns([...columns, { name: newColumnName, type: newColumnType }]);
      setRows(rows.map(row => ({ ...row, [newColumnName]: [] })));
    }
    setNewColumnName('');
  };

  // Add a new row
  const addRow = () => {
    const newRow = {};
    columns.forEach(col => newRow[col.name] = []);
    setRows([...rows, newRow]);
  };

  // Update cell data (array of strings or numbers)
  const updateCell = (rowIndex, columnName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value.split(',').map(item => item.trim());
    setRows(updatedRows);
  };

  // Filter rows based on column data
  const filteredRows = rows.filter(row => 
    columns.some(col => row[col.name].some(val => val.includes(filter)))
  );

  // Sort rows based on number columns
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortColumn || columns.find(col => col.name === sortColumn).type !== 'number') return 0;

    const aValue = parseFloat(a[sortColumn][0]) || 0;
    const bValue = parseFloat(b[sortColumn][0]) || 0;

    return sortOrder === '>=' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dynamic Table with Arrays</h1>

      {/* Column Creation */}
      <div className="mb-6 flex items-center space-x-4">
        <input 
          type="text" 
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="Column Name"
          className="border rounded px-4 py-2"
        />
        <select
          value={newColumnType}
          onChange={(e) => setNewColumnType(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
        </select>
        <button onClick={addColumn} className="bg-blue-500 text-white rounded px-4 py-2">
          Add Column
        </button>
      </div>

      {/* Row Creation */}
      <div className="mb-6">
        <button onClick={addRow} className="bg-green-500 text-white rounded px-4 py-2">
          Add Row
        </button>
      </div>

      {/* Filter and Sort Options */}
      <div className="mb-4 flex items-center space-x-4">
        <input 
          type="text" 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter Rows"
          className="border rounded px-4 py-2"
        />
        <select
          value={sortColumn || ''}
          onChange={(e) => setSortColumn(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Sort By Column</option>
          {columns.map(col => col.type === 'number' && (
            <option key={col.name} value={col.name}>{col.name}</option>
          ))}
        </select>
        <select
          value={sortOrder || '>='}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value=">=">Greater than or equal to</option>
          <option value="<=">Less than or equal to</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.name} className="border px-4 py-2">{col.name} ({col.type})</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(col => (
                  <td key={col.name} className="border px-4 py-2">
                    <input 
                      type="text"
                      value={row[col.name].join(', ')}
                      onChange={(e) => updateCell(rowIndex, col.name, e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

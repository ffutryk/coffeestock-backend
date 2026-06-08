import { useState, useMemo } from 'react';
import './EmployeeStatsTable.css';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'totalSales', label: 'Ventas (Histórico)' },
  { key: 'last30DaysSales', label: 'Ventas (Últimos 30 Días)' },
  { key: 'totalRevenue', label: 'Total Recaudado' },
];

function formatRevenue(value) {
  return '$' + value.toLocaleString('es-AR');
}

export default function EmployeeStatsTable({ data }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('desc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const getSortIndicator = (columnKey) => {
    if (sortColumn !== columnKey) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="employee-stats-table">
      <div className="stats-header">
        {columns.map(col => (
          <div
            key={col.key}
            className={`stats-header-cell ${col.key === 'name' ? 'col-name' : ''} ${col.key === 'totalSales' || col.key === 'last30DaysSales' || col.key === 'totalRevenue' ? 'col-numeric' : ''}`}
            onClick={() => handleSort(col.key)}
          >
            {col.label}
            <span className="sort-indicator">{getSortIndicator(col.key)}</span>
          </div>
        ))}
      </div>
      <div className="stats-rows">
        {sortedData.map(emp => (
          <div key={emp.id} className="stats-row">
            <div className="stats-cell col-id">{emp.id}</div>
            <div className="stats-cell col-name">{emp.name}</div>
            <div className="stats-cell col-numeric">{emp.totalSales.toLocaleString('es-AR')}</div>
            <div className="stats-cell col-numeric">{emp.last30DaysSales.toLocaleString('es-AR')}</div>
            <div className="stats-cell col-numeric">{formatRevenue(emp.totalRevenue)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

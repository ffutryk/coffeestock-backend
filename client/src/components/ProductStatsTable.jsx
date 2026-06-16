import { useState, useMemo } from 'react';
import './ProductStatsTable.css';

const columns = [
  { key: 'index', label: '#' },
  { key: 'nombre', label: 'Producto' },
  { key: 'unidadesVendidas', label: 'Unidades vendidas' },
  { key: 'gananciasGeneradas', label: 'Ganancias generadas' },
];

function formatCurrency(value) {
  return '$' + Number(value).toLocaleString('es-AR');
}

export default function ProductStatsTable({ data }) {
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
    if (!sortColumn || sortColumn === 'index') return data;
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
    <div className="product-stats-table">
      <div className="stats-header">
        {columns.map(col => (
          <div
            key={col.key}
            className={`stats-header-cell ${col.key === 'nombre' ? 'col-name' : ''} ${col.key === 'gananciasGeneradas' || col.key === 'unidadesVendidas' ? 'col-numeric' : ''} ${col.key === 'index' ? 'col-index' : ''}`}
            onClick={() => handleSort(col.key)}
          >
            {col.label}
            <span className="sort-indicator">{getSortIndicator(col.key)}</span>
          </div>
        ))}
      </div>
      <div className="stats-rows">
        {sortedData.map((prod, idx) => (
          <div key={prod.id} className="stats-row">
            <div className="stats-cell col-index">{idx + 1}</div>
            <div className="stats-cell col-name">{prod.nombre}</div>
            <div className="stats-cell col-numeric">{prod.unidadesVendidas.toLocaleString('es-AR')}</div>
            <div className="stats-cell col-numeric">{formatCurrency(prod.gananciasGeneradas)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

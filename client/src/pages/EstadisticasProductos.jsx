import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './EstadisticasProductos.css';
import ProductStatsTable from '../components/ProductStatsTable';
import ProductComparisonChart from '../components/ProductComparisonChart';
import api from '../services/api';

const MOCK_DATA = {
  productosMasVendidos: [
    { id: 1, nombre: 'Café Latte', cantidadVendida: 245, gananciaGenerada: 122500 },
    { id: 2, nombre: 'Capuchino', cantidadVendida: 198, gananciaGenerada: 99000 },
    { id: 3, nombre: 'Espresso', cantidadVendida: 156, gananciaGenerada: 46800 },
    { id: 4, nombre: 'Mocha', cantidadVendida: 134, gananciaGenerada: 67000 },
    { id: 5, nombre: 'Americano', cantidadVendida: 98, gananciaGenerada: 29400 },
  ],
  gananciasTotales: 364700,
  promedioVentaPorTicket: 4250,
};

function formatCurrency(value) {
  return '$' + Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2 });
}

function EstadisticasProductos() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [dateError, setDateError] = useState('');
  const [filterApplied, setFilterApplied] = useState(false);
  const location = useLocation();

  const fetchProductStats = async (inicio, fin) => {
    try {
      setLoading(true);
      setError(null);
      setDateError('');

      const params = {};
      if (inicio) params.fechaInicio = inicio;
      if (fin) params.fechaFin = fin;

      // TODO: Reemplazar con el llamado real al endpoint cuando esté disponible
       const res = await api.get('/estadisticas/productos', { params });
       setStats(res.data);

      // Mock de desarrollo - simula demora de red
      await new Promise(resolve => setTimeout(resolve, 400));
      //setStats(MOCK_DATA);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 500) {
        setStats({ productosMasVendidos: [], gananciasTotales: 0, promedioVentaPorTicket: 0 });
      } else {
        setError(err.response?.data?.message || err.message || 'Error al cargar estadísticas');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilterApplied(false);
    fetchProductStats();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setDateError('');

    if (fechaInicio && fechaFin) {
      if (new Date(fechaInicio) > new Date(fechaFin)) {
        setDateError('La fecha de inicio no puede ser posterior a la fecha de fin');
        return;
      }
    }

    setFilterApplied(true);
    fetchProductStats(fechaInicio, fechaFin);
  };

  const totalUnidades = stats?.productosMasVendidos?.reduce(
    (sum, p) => sum + p.cantidadVendida, 0
  ) ?? 0;

  const hasSales = stats && stats.productosMasVendidos?.length > 0;

  if (loading) {
    return (
      <div className="estadisticas-productos-container">
        <div className="estadisticas-toggle">
          <Link to="/estadisticas/empleados" className="toggle-tab">Estadísticas de Empleados</Link>
          <Link to="/estadisticas/productos" className="toggle-tab active">Estadísticas de Productos</Link>
        </div>
        <div className="loading">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estadisticas-productos-container">
        <div className="estadisticas-toggle">
          <Link to="/estadisticas/empleados" className="toggle-tab">Estadísticas de Empleados</Link>
          <Link to="/estadisticas/productos" className="toggle-tab active">Estadísticas de Productos</Link>
        </div>
        <div className="mensaje-alerta error">{error}</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="estadisticas-productos-container">
      <div className="estadisticas-toggle">
        <Link to="/estadisticas/empleados" className="toggle-tab">Estadísticas de Empleados</Link>
        <Link to="/estadisticas/productos" className="toggle-tab active">Estadísticas de Productos</Link>
      </div>

      <div className="estadisticas-productos-header">
        <div className="header-info">
          <h2>Estadísticas por producto</h2>
          <p>Rendimiento de productos en el sistema</p>
        </div>
      </div>

      <form className="date-filter" onSubmit={handleFilter}>
        <div className="date-input-group">
          <label htmlFor="fechaInicio">Desde</label>
          <input
            id="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => { setFechaInicio(e.target.value); setDateError(''); }}
          />
        </div>
        <div className="date-input-group">
          <label htmlFor="fechaFin">Hasta</label>
          <input
            id="fechaFin"
            type="date"
            value={fechaFin}
            onChange={(e) => { setFechaFin(e.target.value); setDateError(''); }}
          />
        </div>
        <button type="submit" className="btn-filtrar">Filtrar</button>
        {dateError && <span className="date-error">{dateError}</span>}
      </form>

      {!hasSales && !filterApplied ? (
        <div className="no-data-message">
          <p>No hay ventas disponibles para realizar estadísticas</p>
        </div>
      ) : !hasSales && filterApplied ? (
        <>
          <div className="stats-cards">
            <div className="stats-card">
              <span className="stats-card-label">Total facturado</span>
              <span className="stats-card-value">$0</span>
            </div>
            <div className="stats-card">
              <span className="stats-card-label">Total unidades vendidas</span>
              <span className="stats-card-value">0</span>
            </div>
            <div className="stats-card">
              <span className="stats-card-label">Promedio por ticket</span>
              <span className="stats-card-value">$0</span>
            </div>
          </div>
          <div className="no-data-message">
            <p>No existen ventas disponibles para generar estadísticas de productos</p>
          </div>
        </>
      ) : (
        <>
          <div className="stats-cards">
            <div className="stats-card">
              <span className="stats-card-label">Total facturado</span>
              <span className="stats-card-value">{formatCurrency(stats.gananciasTotales)}</span>
            </div>
            <div className="stats-card">
              <span className="stats-card-label">Total unidades vendidas</span>
              <span className="stats-card-value">{totalUnidades.toLocaleString('es-AR')}</span>
            </div>
            <div className="stats-card">
              <span className="stats-card-label">Promedio por ticket</span>
              <span className="stats-card-value">{formatCurrency(stats.promedioVentaPorTicket)}</span>
            </div>
          </div>

          <div className="productos-vendidos-section">
            <div className="productos-vendidos-header">
              <h3>Productos más vendidos</h3>
            </div>
            <ProductStatsTable data={stats.productosMasVendidos} />
          </div>

          <div className="comparativa-section">
            <h3>Comparativa de unidades vendidas</h3>
            <ProductComparisonChart data={stats.productosMasVendidos} />
          </div>
        </>
      )}
    </div>
  );
}

export default EstadisticasProductos;

import { useState, useEffect } from 'react';
import './EstadisticasEmpleados.css';
import EmployeeStatsTable from '../components/EmployeeStatsTable';
import api from "../services/api";

function EstadisticasEmpleados() {
  const [employeeStats, setEmployeeStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mockData = [
      { id: 101, name: 'Carlos García', totalSales: 15200, last30DaysSales: 1450, totalRevenue: 421560 },
      { id: 102, name: 'Ana López', totalSales: 13800, last30DaysSales: 1320, totalRevenue: 389700 },
      { id: 103, name: 'Juan Fernández', totalSales: 11500, last30DaysSales: 1010, totalRevenue: 325400 },
      { id: 104, name: 'María Rodríguez', totalSales: 9800, last30DaysSales: 920, totalRevenue: 290150 },
      { id: 105, name: 'David Sánchez', totalSales: 8400, last30DaysSales: 740, totalRevenue: 245980 },
      { id: 106, name: 'Sofía Martínez', totalSales: 6100, last30DaysSales: 510, totalRevenue: 9178600 },
      { id: 107, name: 'Pedro Cuesta', totalSales: 4500, last30DaysSales: 11180, totalRevenue: 110450 },
      { id: 108, name: 'Elena Ruiz', totalSales: 8200, last30DaysSales: 250, totalRevenue: 78900 },
    ];

    const fetchEmployeeStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- Endpoint API (comentado para desarrollo Frontend) ---
        // GET /estadisticas/empleados
        // Headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // Respuesta esperada (200 OK):
        // [
        //   {
        //     "id": 101,
        //     "nombre": "Carlos García",
        //     "totalVentas": 15200,
        //     "ventasUltimos30Dias": 1450,
        //     "totalRecaudado": 421560.00
        //   },
        //   ...
        // ]
        const res = await api.get("/estadisticas/empleados");

        setEmployeeStats(res.data);
        // --------------------------------------------------------

        //setEmployeeStats(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, []);

  if (loading) {
    return (
      <div className="estadisticas-empleados-container">
        <div className="loading">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estadisticas-empleados-container">
        <div className="mensaje-alerta error">{error}</div>
      </div>
    );
  }

  return (
    <div className="estadisticas-empleados-container">
      <div className="estadisticas-empleados-header">
        <h2 className="page-title">Estadísticas por empleado</h2>
      </div>
      <EmployeeStatsTable data={employeeStats} />
      <p className="footer-note">COMPARATIVA DE VENTAS POR EMPLEADO</p>
    </div>
  );
}

export default EstadisticasEmpleados;

import { useState, useEffect } from 'react';
import './EstadisticasEmpleados.css';
import EmployeeStatsTable from '../components/EmployeeStatsTable';
import api from "../services/api";

function EstadisticasEmpleados() {
  const [employeeStats, setEmployeeStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchEmployeeStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/estadisticas/empleados");

        setEmployeeStats(res.data);

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

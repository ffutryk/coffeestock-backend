import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsuarios, updateUsuario, deleteUsuario } from "../services/usuarios";
import { parseApiError } from "../utils/parseApiError";
import "./Empleados.css";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", apellido: "", email: "", rol: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const response = await getUsuarios({ page: 1, limit: 100 });
      // response es { data: [...], total: ... }
      setEmpleados(response.data || []);
    } catch (err) {
      console.error("Error al cargar empleados:", err);
      setError("No se pudieron cargar los empleados.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (empleado) => {
    setEditingEmpleado(empleado);
    setEditForm({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      email: empleado.email,
      rol: empleado.rol
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await updateUsuario(editingEmpleado.id, editForm);
      setEditingEmpleado(null);
      fetchEmpleados();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || "Error al actualizar empleado");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) return;
    try {
      await deleteUsuario(id);
      fetchEmpleados();
    } catch (err) {
      setError("Error al eliminar el empleado.");
    }
  };

  if (loading) return <div className="loading">Cargando empleados...</div>;

  return (
    <div className="empleados-container">
      <div className="empleados-header">
        <div className="header-info">
          <h2>Gestión de Empleados</h2>
          <p>{empleados.length} empleados registrados en el sistema</p>
        </div>
        <Link to="/register" className="btn-nuevo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Registrar Nuevo
        </Link>
      </div>

      {error && <div className="error-message" style={{ color: "var(--error-color)", padding: "1rem", backgroundColor: "#fee2e2", borderRadius: "8px" }}>{error}</div>}

      <div className="empleados-list-section">
        {empleados.length === 0 ? (
          <div className="empty-state">
            <p>No hay empleados registrados.</p>
          </div>
        ) : (
          <table className="empleados-tabla">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>CUIL</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <strong>{emp.nombre} {emp.apellido}</strong>
                  </td>
                  <td>{emp.cuil}</td>
                  <td>{emp.email}</td>
                  <td>
                    <span className={`role-badge ${emp.rol.toLowerCase()}`}>
                      {emp.rol}
                    </span>
                  </td>
                  <td className="acciones-cell">
                    <button 
                      className="btn-accion edit" 
                      title="Editar"
                      onClick={() => handleEdit(emp)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button 
                      className="btn-accion delete" 
                      title="Eliminar"
                      onClick={() => handleDelete(emp.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingEmpleado && (
        <div className="edit-overlay">
          <div className="edit-card">
            <h3>Editar Empleado</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Nombre</label>
                <input 
                  type="text" 
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input 
                  type="text" 
                  value={editForm.apellido}
                  onChange={(e) => setEditForm({...editForm, apellido: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select 
                  value={editForm.rol}
                  onChange={(e) => setEditForm({...editForm, rol: e.target.value})}
                >
                  <option value="EMPLEADO">Empleado</option>
                  <option value="GERENTE">Gerente</option>
                </select>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancelar" 
                  onClick={() => setEditingEmpleado(null)}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-guardar"
                  disabled={submitting}
                >
                  {submitting ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { crearMateriaPrima } from "../../services/materias-primas.js";
import "./CrearMateriaPrima.css";

const IconBox = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);
const IconTag = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const IconScale = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="3" x2="12" y2="21" />
    <path d="M3 9l9-7 9 7" />
    <path d="M3 15h18" />
  </svg>
);
const IconHash = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);
const IconArchive = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

const FORM_INICIAL = {
  nombre: "",
  marca: "",
  unidadDeMedida: "",
  cantidadPorUnidad: "",
  stockInicial: "",
  stockMinimo: "",
};

export default function CrearMateriaPrima({ onClose, onSuccess }) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const [_data, validationErrors] = await crearMateriaPrima({
        nombre: form.nombre,
        marca: form.marca,
        unidad: form.unidadDeMedida,
        cantidad_unidad: Number(form.cantidadPorUnidad),
        stockInicial: Number(form.stockInicial),
        stockMinimo: form.stockMinimo ? Number(form.stockMinimo) : null,
      });

      if (validationErrors) {
        setValidationErrors(validationErrors);
        return;
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-mp">
      <div className="modal-header">
        <h2>Crear materia prima</h2>
        <p>Complete los campos para registrar una nueva materia prima</p>
      </div>
      <hr className="modal-divider" />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="nombre">
            <IconBox /> Nombre
          </label>
          <input
            className="form-input"
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Ej: Café Arábica"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          {validationErrors.nombre && (
            <p className="input-error">{validationErrors.nombre}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="marca">
            <IconTag /> Marca
          </label>
          <input
            className="form-input"
            id="marca"
            name="marca"
            type="text"
            placeholder="Ej: Lavazza"
            value={form.marca}
            onChange={handleChange}
          />
          {validationErrors.marca && (
            <p className="input-error">{validationErrors.marca}</p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="unidadDeMedida">
              <IconScale /> Unidad de medida
            </label>
            <div className="select-wrapper">
              <select
                className="form-select"
                id="unidadDeMedida"
                name="unidadDeMedida"
                value={form.unidadDeMedida}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Seleccionar...
                </option>
                <option value="Gramos">Gramos (g)</option>
                <option value="Kilogramos">Kilogramos (kg)</option>
                <option value="Mililitros">Mililitros (ml)</option>
                <option value="Litros">Litros (l)</option>
                <option value="Unidades">Unidad</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cantidadPorUnidad">
              <IconHash /> Cantidad por unidad
            </label>
            <input
              className="form-input"
              id="cantidadPorUnidad"
              name="cantidadPorUnidad"
              type="number"
              min="0"
              placeholder="Ej: 250"
              value={form.cantidadPorUnidad}
              onChange={handleChange}
              required
            />
          </div>
          {validationErrors.cantidadPorUnidad && (
            <p className="input-error">{validationErrors.cantidadPorUnidad}</p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="stockInicial">
              <IconArchive /> Stock inicial
            </label>
            <input
              className="form-input"
              id="stockInicial"
              name="stockInicial"
              type="number"
              min="0"
              placeholder="Ej: 100"
              value={form.stockInicial}
              onChange={handleChange}
              required
            />
            {validationErrors.stockInicial && (
              <p className="input-error">{validationErrors.stockInicial}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="stockMinimo">
              <IconArchive /> Stock mínimo
              <span className="label-optional">(opcional)</span>
            </label>
            <input
              className="form-input"
              id="stockMinimo"
              name="stockMinimo"
              type="number"
              min="0"
              placeholder="Ej: 20"
              value={form.stockMinimo}
              onChange={handleChange}
            />
            {validationErrors.stockMinimo && (
              <p className="input-error">{validationErrors.stockMinimo}</p>
            )}
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar materia prima"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

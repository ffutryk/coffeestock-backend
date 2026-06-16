// pages/EditarCombo.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ComboProductoRow from "../components/ComboProductoRow";
import ComboStockPreview from "../components/ComboStockPreview";
import "./EditarCombo.css";

export default function EditarCombo() {
  const { comboId } = useParams();
  const navigate = useNavigate();

  const [combo, setCombo] = useState(null);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [form, setForm] = useState({ nombre: "", precio: "", items: [] });
  const [errores, setErrores] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Carga inicial ──────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        const [resCombo, resProd] = await Promise.all([
          api.get(`/combos/${comboId}`),
          api.get("/productos"),
        ]);

        const data = resCombo.data.data ?? resCombo.data;
        setCombo(data);
        setProductosDisponibles(resProd.data);
        setForm({
          nombre: data.nombre,
          precio: String(data.precio),
          items: (data.items ?? data.productos ?? []).map((item) => ({
            productoId: item.producto?.id ?? item.productoId ?? item.id,
            nombre: item.producto?.nombre ?? item.nombre,
            cantidad: item.cantidad ?? 1,
          })),
        });
      } catch {
        setErrorGlobal("No se pudo cargar el combo.");
      }
    };
    cargar();
  }, [comboId]);

  // ── Validaciones ───────────────────────────────────────────────
  const validar = () => {
    const e = {};

    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";

    const precio = Number(form.precio);
    if (!form.precio || isNaN(precio) || precio < 0)
      e.precio = "El precio debe ser un número positivo.";

    if (form.items.length < 2)
      e.items = "Un combo debe tener al menos 2 productos.";

    form.items.forEach((item, i) => {
      if (!item.productoId) e[`item_${i}`] = "Seleccioná un producto.";
    });

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const puedeGuardar =
    form.nombre.trim() &&
    Number(form.precio) >= 0 &&
    form.items.length >= 2 &&
    form.items.every((i) => i.productoId);

  // ── Handlers ───────────────────────────────────────────────────
  const handleItemChange = (index, nuevoItem) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = nuevoItem;
      return { ...prev, items };
    });
    setErrores((prev) => {
      const e = { ...prev };
      delete e[`item_${index}`];
      delete e.items;
      return e;
    });
  };

  const handleAgregarProducto = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productoId: null, nombre: "", cantidad: 1 }],
    }));
  };

  const handleRemoveItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!validar()) return;
    setSubmitting(true);
    setErrorGlobal("");
    try {
      await api.put(`/combos/${comboId}`, {
        nombre: form.nombre.trim(),
        precio: Number(form.precio),
        items: form.items.map(({ productoId, cantidad }) => ({
          productoId,
          cantidad,
        })),
      });
      setShowSuccess(true);
      setTimeout(() => navigate("/vender"), 2000);
    } catch {
      setErrorGlobal("Error al guardar los cambios. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  if (!combo && !errorGlobal)
    return <p className="ec-loading">Cargando combo…</p>;

  if (errorGlobal && !combo)
    return <p className="ec-error-global">{errorGlobal}</p>;

  return (
    <div className="ec-wrapper">
      <div className="ec-card">
        {/* Header */}
        <div className="ec-header">
          <div>
            <h2 className="ec-title">Editar Combo</h2>
            <p className="ec-subtitle">
              #{combo.id} · Modificá los datos del combo
            </p>
          </div>
          <button
            className="ec-btn-back"
            onClick={() => navigate("/vender")}
            disabled={submitting}
          >
            ← Volver
          </button>
        </div>

        <div className="ec-divider" />

        {/* Nombre */}
        <div className="ec-field">
          <label className="ec-label">
            Nombre del combo <span className="ec-required">*</span>
          </label>
          <input
            className={`ec-input ${errores.nombre ? "ec-input--error" : ""}`}
            type="text"
            value={form.nombre}
            onChange={(e) => {
              setForm((p) => ({ ...p, nombre: e.target.value }));
              setErrores((p) => ({ ...p, nombre: undefined }));
            }}
            placeholder="Ej: Desayuno Completo"
            disabled={submitting}
          />
          {errores.nombre && <p className="ec-field-error">{errores.nombre}</p>}
        </div>

        <div className="ec-divider" />

        {/* Productos */}
        <div className="ec-field">
          <div className="ec-productos-header">
            <label className="ec-label">
              Productos del combo <span className="ec-required">*</span>
            </label>
            <button
              type="button"
              className="ec-btn-agregar"
              onClick={handleAgregarProducto}
              disabled={submitting}
            >
              + Agregar producto
            </button>
          </div>

          {errores.items && <p className="ec-field-error">{errores.items}</p>}

          <div className="ec-productos-list">
            {form.items.map((item, index) => (
              <ComboProductoRow
                key={index}
                item={item}
                index={index}
                productosDisponibles={productosDisponibles}
                onChange={handleItemChange}
                onRemove={handleRemoveItem}
                disabled={submitting}
                error={errores[`item_${index}`]}
              />
            ))}

            {form.items.length === 0 && (
              <p className="ec-empty-warn">
                ⚠ Agregá al menos 2 productos al combo.
              </p>
            )}
          </div>
        </div>

        {/* Stock preview — se recalcula en tiempo real */}
        <ComboStockPreview
          items={form.items}
          productosDisponibles={productosDisponibles}
        />

        <div className="ec-divider" />

        {/* Precio */}
        <div className="ec-field">
          <label className="ec-label">
            Precio del combo <span className="ec-required">*</span>
          </label>
          <div className="ec-precio-wrapper">
            <span className="ec-precio-prefix">$</span>
            <input
              className={`ec-input ec-input--precio ${errores.precio ? "ec-input--error" : ""}`}
              type="number"
              min="0"
              value={form.precio}
              onChange={(e) => {
                setForm((p) => ({ ...p, precio: e.target.value }));
                setErrores((p) => ({ ...p, precio: undefined }));
              }}
              placeholder="0"
              disabled={submitting}
            />
          </div>
          {errores.precio && <p className="ec-field-error">{errores.precio}</p>}
        </div>

        <div className="ec-divider" />

        {errorGlobal && <p className="ec-error-global">{errorGlobal}</p>}

        {/* Acciones */}
        <div className="ec-actions">
          <button
            className="ec-btn-save"
            onClick={handleSave}
            disabled={!puedeGuardar || submitting}
          >
            {submitting ? "Guardando…" : "Guardar Cambios"}
          </button>
          <button
            className="ec-btn-cancel"
            onClick={() => navigate("/vender")}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal de éxito */}
      {showSuccess && (
        <div className="ec-modal-overlay">
          <div className="ec-modal">
            <h3>✅ Combo actualizado correctamente</h3>
            <p>Redirigiendo al mostrador…</p>
          </div>
        </div>
      )}
    </div>
  );
}

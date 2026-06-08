import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import MedioPagoSelect from "../components/MedioDePagoSelect";
import ProductosList from "../components/ProductosList";
import { getVentaPorId, actualizarVenta } from "../services/ventas";
import { getTodosLosProductos } from "../services/productos";
import "./EditarVenta.css";

export default function EditVentaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venta, setVenta] = useState(null);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [editForm, setEditForm] = useState({ medioDePago: "", items: [] });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const responseVenta = await getVentaPorId(id);
      const responseProductos = await getTodosLosProductos();
      setVenta(responseVenta.data);
      setProductosDisponibles(responseProductos);
      setEditForm({
        medioDePago: responseVenta.data.medioDePago,
        items: responseVenta.data.items.map((item) => ({
          productoId: item.productoId,
          nombre: item.nombre,
          precio: Number(item.precio),
          cantidad: item.cantidad,
        })),
      });
    };
    cargar();
  }, [id]);

  const validarItem = (item) => {
    const cantidadOriginal =
      venta.items.find((i) => i.productoId === item.productoId)?.cantidad || 0;
    const producto = productosDisponibles.find((p) => p.id === item.productoId);
    const stockActual = producto?.stock || 0;
    const maxPermitido = stockActual + cantidadOriginal;
    const isValid = item.cantidad > 0 && item.cantidad <= maxPermitido;
    return {
      isValid,
      exceedsStock: item.cantidad > maxPermitido,
      maxAllowed: maxPermitido,
      message:
        item.cantidad > maxPermitido
          ? `Cantidad supera el stock disponible (Máx: ${maxPermitido})`
          : "",
    };
  };

  const puedeGuardar = () => {
    if (editForm.items.length === 0) return false;
    return !editForm.items.some((item) => !validarItem(item).isValid);
  };

  const onUpdateForm = (changes) => {
    console.log("Actualizando form con cambios:", changes);
    setEditForm((prev) => ({ ...prev, ...changes }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError("");
    try {
      await actualizarVenta(id, {
        medioDePago: editForm.medioDePago,
        items: editForm.items.map(({ productoId, cantidad }) => ({
          productoId,
          cantidad,
        })),
      });
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/historial-ventas");
      }, 2000);
    } catch (err) {
      setError("Error al guardar los cambios.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!venta) return <p className="ev-loading">Cargando...</p>;

  const total = editForm.items.reduce(
    (sum, item) => sum + Number(item.precio) * item.cantidad,
    0,
  );

  return (
    <div className="ev-wrapper">
      <div className="ev-card">
        <div className="ev-header">
          <div>
            <h2 className="ev-title">Actualizar venta</h2>
            <div className="ev-meta">
              <span className="ev-meta-item">
                <span className="ev-meta-icon">#</span> Venta #{venta.id}
              </span>
              <span className="ev-meta-item">
                <span className="ev-meta-icon">📅</span>
                {new Date(venta.createdAt).toLocaleDateString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        <div className="ev-divider" />

        <MedioPagoSelect
          value={editForm.medioDePago}
          onChange={(val) => onUpdateForm({ medioDePago: val })}
          disabled={submitting}
        />

        <div className="ev-divider" />

        <ProductosList
          venta={venta}
          editForm={editForm}
          productosDisponibles={productosDisponibles}
          validarItem={validarItem}
          onUpdateForm={onUpdateForm}
          disabled={submitting}
        />

        {editForm.items.length === 0 && (
          <p className="ev-empty-warn">
            ⚠ La venta debe contener al menos un producto.
          </p>
        )}

        {error && <p className="ev-error">{error}</p>}

        <div className="ev-divider" />

        <div className="ev-total-row">
          <span className="ev-total-label">Total de la venta:</span>
          <span className="ev-total-amount">${total.toFixed(2)}</span>
        </div>

        <div className="ev-actions">
          <button
            className="ev-btn-save"
            onClick={handleSave}
            disabled={!puedeGuardar() || submitting}
          >
            {submitting ? "Guardando..." : "Actualizar venta"}
          </button>
          <button
            className="ev-btn-cancel"
            onClick={() => navigate("/historial-ventas")}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </div>
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>✅ Venta actualizada correctamente</h3>
            <p>Redirigiendo al historial...</p>
          </div>
        </div>
      )}
    </div>
  );
}

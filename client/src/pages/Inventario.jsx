import { useState, useEffect } from "react";
import api from "../services/api";
import "./Inventario.css";
import { useModal } from "../context/ModalContext";

const InventoryItemCard = ({ item, onUpdateStock }) => {
  const pct = item.stockMinimo > 0
    ? (item.stockActual / item.stockMinimo) * 100
    : 100;
  const status = item.stockActual < item.stockMinimo / 2
    ? "critical"
    : item.stockActual < item.stockMinimo
      ? "low"
      : "ok";

  return (
    <div className={`inventory-item-card ${status}`}>
      <div className="item-header">
        <h3 className="item-name">{item.nombre}</h3>
        <span className={`item-status-badge ${status}`}>
          {status === "ok" ? "OK" : status.toUpperCase()}
        </span>
      </div>
      <p className="item-stock">
        <span className="current-stock">{item.stockActual}</span>
        <span className="capacity"> / {item.stockMinimo} {item.unidadDeMedida}</span>
      </p>
      <div className="stock-bar-container">
        <div className="stock-bar" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <div className="item-controls">
        <button className="control-btn sub" onClick={() => onUpdateStock(item.id, -10)}>−10</button>
        <button className="control-btn sub" onClick={() => onUpdateStock(item.id, -1)}>−1</button>
        <button className="control-btn add" onClick={() => onUpdateStock(item.id, 1)}>+1</button>
        <button className="control-btn add" onClick={() => onUpdateStock(item.id, 10)}>+10</button>
      </div>
    </div>
  );
};

const SummaryCards = ({ totalItems, lowStockItems, criticalStockItems }) => (
  <div className="summary-cards-container">
    <div className="summary-card">
      <span className="card-icon">📦</span>
      <p className="card-title">Total Items</p>
      <p className="card-value">{totalItems}</p>
    </div>
    <div className="summary-card low">
      <span className="card-icon">⚠️</span>
      <p className="card-title">Stock Bajo</p>
      <p className="card-value">{lowStockItems}</p>
    </div>
    <div className="summary-card critical">
      <span className="card-icon">🚨</span>
      <p className="card-title">Stock Crítico</p>
      <p className="card-value">{criticalStockItems}</p>
    </div>
  </div>
);

export default function Inventario() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ text: "", type: "" });
  const { abrir } = useModal();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get("/inventario");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      showMensaje("Error al cargar inventario", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (itemId, change) => {
    const prev = [...inventory];
    setInventory(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, stockActual: Math.max(0, item.stockActual + change) }
          : item
      )
    );
    try {
      await api.post("/inventario/movimientos", {
        idMateriaPrima: itemId,
        cantidad: Math.abs(change),
        motivo: change > 0 ? "COMPRA" : "DESCARTE",
      });
      showMensaje("Stock actualizado", "success");
    } catch (error) {
      console.error("Error updating stock:", error);
      setInventory(prev);
      showMensaje("Error al actualizar stock", "error");
    }
  };

  const showMensaje = (text, type) => {
    setMensaje({ text, type });
    setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
  };
    
  const lowStockItems = inventory.filter(
    (i) => i.stockActual < i.stockMinimo && i.stockActual >= i.stockMinimo / 2
  ).length;
  const criticalStockItems = inventory.filter(
    (i) => i.stockActual < i.stockMinimo / 2
  ).length;

  if (loading) return <div className="loading">Cargando inventario...</div>;

  const handleAgregarMateriaPrima = () => {
    abrir("crear-materia-prima", {
      onSuccess: fetchInventory,
    });
  };
    
  return (
      <div className="inventario-container">
      <h2 className="page-title">Inventario</h2>

      <SummaryCards
        totalItems={inventory.length}
        lowStockItems={lowStockItems}
        criticalStockItems={criticalStockItems}
      />

      <div className="inventory-grid">
        {inventory.map((item) => (
          <InventoryItemCard
            key={item.id}
            item={item}
            onUpdateStock={handleUpdateStock}
          />
        ))}
      </div>

      {mensaje.text && (
        <div className={`mensaje-alerta ${mensaje.type}`}>
          {mensaje.text}
        </div>
          )}
          
      <div className="floating-bottom-right">
        <button onClick={handleAgregarMateriaPrima} className="control-btn">
          Agregar Materia Prima
        </button>
      </div>
    </div>
  );
}

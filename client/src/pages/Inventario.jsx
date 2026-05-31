import { useState, useEffect } from "react";
import api from "../services/api";
import "./Inventario.css";

const InventoryItemCard = ({ item, onUpdateStock }) => {
  const pct = item.capacity > 0 ? (item.currentStock / item.capacity) * 100 : 0;
  const status = pct <= 15 ? "critical" : pct <= 30 ? "low" : "ok";

  return (
    <div className={`inventory-item-card ${status}`}>
      <div className="item-header">
        <h3 className="item-name">{item.name}</h3>
        <span className={`item-status-badge ${status}`}>
          {status === "ok" ? "OK" : status.toUpperCase()}
        </span>
      </div>
      <p className="item-stock">
        <span className="current-stock">{item.currentStock}</span>
        <span className="capacity"> / {item.capacity} {item.unit}</span>
      </p>
      <div className="stock-bar-container">
        <div className="stock-bar" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <div className="item-controls">
        <button className="control-btn" onClick={() => onUpdateStock(item.id, -10)}>-10</button>
        <button className="control-btn" onClick={() => onUpdateStock(item.id, -1)}>-1</button>
        <button className="control-btn plus" onClick={() => onUpdateStock(item.id, 1)}>+1</button>
        <button className="control-btn plus" onClick={() => onUpdateStock(item.id, 10)}>+10</button>
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

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // Placeholder: reemplazar con api.get("/inventory")
      // const response = await api.get("/inventory");
      // setInventory(response.data);
      const mock = [
        { id: "1", 
          name: "Granos de Café Arábica", 
          currentStock: 180, 
          capacity: 200, 
          unit: "kg" 
        },
        { id: "2", name: "Leche Entera", currentStock: 45, capacity: 50, unit: "lt" },
        { id: "3", name: "Leche Deslactosada", currentStock: 8, capacity: 30, unit: "lt" },
        { id: "4", name: "Jarabe de Vainilla", currentStock: 12, capacity: 15, unit: "btl" },
        { id: "5", name: "Jarabe de Caramelo", currentStock: 4, capacity: 20, unit: "btl" },
        { id: "6", name: "Vasos 16oz", currentStock: 500, capacity: 500, unit: "pcs" },
        { id: "7", name: "Tapas para Vasos", currentStock: 60, capacity: 500, unit: "pcs" },
        { id: "8", name: "Azúcar", currentStock: 10, capacity: 25, unit: "kg" },
      ];
      setInventory(mock);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      showMensaje("Error al cargar inventario", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (itemId, change) => {
    const prev = [...inventory];
    setInventory(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, currentStock: Math.max(0, item.currentStock + change) }
          : item
      )
    );
    try {
      // Placeholder: api.put(`/inventory/${itemId}`, { change })
      // await api.put(`/inventory/${itemId}`, { change });
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

  const getPct = (item) =>
    item.capacity > 0 ? (item.currentStock / item.capacity) * 100 : 0;

  const lowStockItems = inventory.filter(
    (i) => getPct(i) > 15 && getPct(i) <= 30
  ).length;
  const criticalStockItems = inventory.filter(
    (i) => getPct(i) <= 15
  ).length;

  if (loading) return <div className="loading">Cargando inventario...</div>;

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
    </div>
  );
}

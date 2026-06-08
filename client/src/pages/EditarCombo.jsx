import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getComboPorId, actualizarCombo } from "../services/combos";
import { getTodosLosProductos } from "../services/productos";

import ComboForm from "../components/ComboForm";

import "./EditarCombo.css";

export default function EditarCombo() {
  const { comboId } = useParams();
  const navigate = useNavigate();

  const [combo, setCombo] = useState(null);
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      const comboResponse = await getComboPorId(comboId);
      const productos = await getTodosLosProductos();
      console.log(comboResponse);
      console.log(productos);

      setCombo(comboResponse.data);
      setProductosDisponibles(productos);
    };

    cargar();
  }, [comboId]);

  const handleSave = async (formData) => {
    try {
      setSubmitting(true);

      await actualizarCombo(comboId, formData);

      navigate("/vender");
    } catch {
      setError("Error al actualizar el combo");
    } finally {
      setSubmitting(false);
    }
  };

  if (!combo) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="editar-combo-page">
      <div className="editar-combo-card">
        <h1>Editar Combo</h1>

        <ComboForm
          combo={combo}
          productosDisponibles={productosDisponibles}
          onSave={handleSave}
          onCancel={() => navigate("/vender")}
          submitting={submitting}
          error={error}
        />
      </div>
    </div>
  );
}

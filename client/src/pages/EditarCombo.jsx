import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getComboPorId, actualizarCombo } from "../services/combos";
import { getTodosLosProductos } from "../services/productos";

import ComboForm from "../components/ComboForm";

import "./EditarCombo.css";

export default function EditarCombo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [combo, setCombo] = useState(null);
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      const comboResponse = await getComboPorId(id);
      const productos = await getTodosLosProductos();

      setCombo(comboResponse.data);
      setProductosDisponibles(productos);
    };

    cargar();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setSubmitting(true);

      await actualizarCombo(id, formData);

      navigate("/mostrador");
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
          onCancel={() => navigate("/mostrador")}
          submitting={submitting}
          error={error}
        />
      </div>
    </div>
  );
}

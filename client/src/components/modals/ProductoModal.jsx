import { useState, useEffect } from "react";
import { parseApiError } from "../../utils/parseApiError";
import Modal from "./Modal";

const Icons = {
    Box: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    ),
    FileText: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    ),
    Filter: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
    ),
    Wheat: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 22l10-10"></path>
            <path d="M3.4 16.9l2.7 2.7"></path>
            <path d="M5.4 12.5l4.8 4.8"></path>
            <path d="M8.2 8.7l5.3 5.3"></path>
            <path d="M12.1 5.9l4.5 4.5"></path>
            <path d="M16 4.1l2.8 2.8"></path>
            <path d="M21.9 2.1l-10 10"></path>
        </svg>
    ),
    ChefHat: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
            <line x1="6" y1="17" x2="18" y2="17"></line>
        </svg>
    ),
    Dollar: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
    ),
    Trash: () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
};

const initialFormState = {
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    tipo: "PRODUCTO",
    sinTacc: false,
    tieneReceta: false,
    ingredientes: [],
};

export default function ProductoModal({
    isOpen,
    onClose,
    producto,
    onSave,
    materiasPrimas,
}) {
    const [form, setForm] = useState(() => {
        if (producto) {
            return {
                nombre: producto.nombre,
                descripcion: producto.descripcion || "",
                precio: producto.precio,
                stock: producto.stock ?? "",
                tipo: producto.tipo,
                sinTacc: producto.sinTacc,
                tieneReceta: producto.tieneReceta || false,
                ingredientes: producto.ingredientes || [],
            };
        }
        return initialFormState;
    });

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        if (producto) {
            const ingredientesFormateados = (producto.ingredientes || []).map(
                (ing) => ({
                    idMateriaPrima:
                        ing.materiaPrima?.id ?? ing.materiaPrimaId ?? "",
                    cantidad: ing.cantidad ?? "",
                }),
            );

            setForm({
                nombre: producto.nombre,
                descripcion: producto.descripcion || "",
                precio: producto.precio,
                stock: producto.stock ?? "",
                tipo: producto.tipo,
                sinTacc: producto.sinTacc,
                tieneReceta: producto.tieneReceta || false,
                ingredientes: ingredientesFormateados,
            });
        } else {
            setForm(initialFormState);
        }
        setFormError("");
    }, [producto, isOpen]);

    const handleAddIngredient = () => {
        setForm({
            ...form,
            ingredientes: [
                ...form.ingredientes,
                { idMateriaPrima: "", cantidad: "" },
            ],
        });
    };

    const handleRemoveIngredient = (index) => {
        const nuevosIngredientes = form.ingredientes.filter(
            (_, i) => i !== index,
        );
        setForm({ ...form, ingredientes: nuevosIngredientes });
    };

    const handleIngredientChange = (index, field, value) => {
        const nuevosIngredientes = [...form.ingredientes];
        nuevosIngredientes[index][field] = value;
        setForm({ ...form, ingredientes: nuevosIngredientes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError("");

        // Validación de ingredientes si tiene receta
        if (form.tieneReceta) {
            const ingredientesValidos = form.ingredientes.filter(
                (ing) => ing.idMateriaPrima && ing.cantidad,
            );
            if (ingredientesValidos.length === 0) {
                setFormError(
                    "Debe agregar al menos un ingrediente válido para la receta.",
                );
                setSubmitting(false);
                return;
            }
        }

        let payload = {};
        const isEditing = !!producto;

        if (isEditing) {
            // Campos escalares
            if (form.nombre !== producto.nombre) payload.nombre = form.nombre;
            if (form.descripcion !== (producto.descripcion || ""))
                payload.descripcion = form.descripcion;
            if (Number(form.precio) !== producto.precio)
                payload.precio = Number(form.precio);
            const newStock = form.stock === "" ? null : Number(form.stock);
            if (newStock !== producto.stock) payload.stock = newStock;
            if (form.sinTacc !== producto.sinTacc)
                payload.sinTacc = form.sinTacc;

            // Comparar ingredientes actuales con los originales
            const ingredientesOriginales = (producto.ingredientes || []).map(
                (ing) => ({
                    idMateriaPrima: ing.materiaPrima?.id ?? ing.idMateriaPrima,
                    cantidad: ing.cantidad,
                }),
            );

            const ingredientesActuales = form.tieneReceta
                ? form.ingredientes.map((ing) => ({
                      idMateriaPrima: Number(ing.idMateriaPrima),
                      cantidad: Number(ing.cantidad),
                  }))
                : [];

            // Función simple para comparar arrays de ingredientes (ignorando orden)
            const sonIguales = (a, b) => {
                if (a.length !== b.length) return false;
                const ordenados = (arr) =>
                    [...arr].sort(
                        (x, y) => x.idMateriaPrima - y.idMateriaPrima,
                    );
                return (
                    JSON.stringify(ordenados(a)) ===
                    JSON.stringify(ordenados(b))
                );
            };

            if (!sonIguales(ingredientesActuales, ingredientesOriginales)) {
                payload.ingredientes = ingredientesActuales;
            }
            // Si son iguales, NO enviamos el campo ingredientes
        } else {
            // Creación: siempre enviar ingredientes si tiene receta
            payload = {
                nombre: form.nombre,
                descripcion: form.descripcion || undefined,
                precio: Number(form.precio),
                tipo: form.tipo,
                sinTacc: form.sinTacc,
                stock: form.stock === "" ? null : Number(form.stock),
                ingredientes: form.tieneReceta
                    ? form.ingredientes.map((ing) => ({
                          idMateriaPrima: Number(ing.idMateriaPrima),
                          cantidad: Number(ing.cantidad),
                      }))
                    : undefined,
            };
        }

        // Si el payload quedó vacío (ningún cambio), quizás mostrar mensaje o cerrar sin hacer nada
        if (isEditing && Object.keys(payload).length === 0) {
            setFormError("No se detectaron cambios.");
            setSubmitting(false);
            return;
        }

        try {
            await onSave(payload, producto?.id);
            onClose();
        } catch (err) {
            const parsed = parseApiError(err);
            setFormError(parsed.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="custom-form-container">
                <div className="custom-form-header">
                    <h3>{producto ? "Editar producto" : "Crear producto"}</h3>
                    <p>
                        Complete los campos para{" "}
                        {producto ? "actualizar el" : "registrar un nuevo"}{" "}
                        producto
                    </p>
                </div>

                {formError && (
                    <div
                        className="error-message"
                        style={{ marginBottom: "1rem" }}
                    >
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="custom-form-group">
                        <label className="icon-label">
                            <Icons.Box /> Nombre{" "}
                            <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className="custom-input"
                            value={form.nombre}
                            onChange={(e) =>
                                setForm({ ...form, nombre: e.target.value })
                            }
                            placeholder="Ej: Cortado (mínimo 3 caracteres)"
                            required
                        />
                    </div>

                    <div className="custom-form-group">
                        <label className="icon-label">
                            <Icons.FileText /> Descripción{" "}
                            <span className="optional">(opcional)</span>
                        </label>
                        <textarea
                            className="custom-input"
                            value={form.descripcion}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    descripcion: e.target.value,
                                })
                            }
                            placeholder="Ej: Café espresso con leche vaporizada"
                            rows="3"
                        />
                    </div>

                    {!producto && (
                        <div className="custom-form-group">
                            <label className="icon-label">
                                <Icons.Filter /> Tipo{" "}
                                <span className="required">*</span>
                            </label>
                            <select
                                className="custom-input"
                                value={form.tipo}
                                onChange={(e) =>
                                    setForm({ ...form, tipo: e.target.value })
                                }
                                required
                            >
                                <option value="">Seleccionar tipo...</option>
                                <option value="PRODUCTO">Producto</option>
                                <option value="COMBO">Combo</option>
                            </select>
                        </div>
                    )}

                    <div className="checkbox-cards-container">
                        <label
                            className={`checkbox-card ${form.sinTacc ? "active" : ""}`}
                        >
                            <input
                                type="checkbox"
                                checked={form.sinTacc}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        sinTacc: e.target.checked,
                                    })
                                }
                            />
                            <Icons.Wheat /> Sin TACC
                        </label>

                        <label
                            className={`checkbox-card ${form.tieneReceta ? "active" : ""}`}
                        >
                            <input
                                type="checkbox"
                                checked={form.tieneReceta}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        tieneReceta: e.target.checked,
                                    })
                                }
                            />
                            <Icons.ChefHat /> Tiene Receta
                        </label>
                    </div>

                    <div className="custom-form-row">
                        <div className="custom-form-group">
                            <label className="icon-label">
                                <Icons.Box /> Stock{" "}
                                <span className="optional">(opcional)</span>
                            </label>
                            <input
                                type="number"
                                className="custom-input"
                                value={form.tieneReceta ? "" : form.stock}
                                onChange={(e) =>
                                    setForm({ ...form, stock: e.target.value })
                                }
                                placeholder={
                                    form.tieneReceta
                                        ? "Bloqueado (tiene receta)"
                                        : "Ej: 50"
                                }
                                disabled={form.tieneReceta}
                            />
                        </div>

                        <div className="custom-form-group">
                            <label className="icon-label">
                                <Icons.Dollar /> Precio{" "}
                                <span className="required">*</span>
                            </label>
                            <div className="input-with-prefix">
                                <span className="prefix">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="custom-input with-prefix"
                                    value={form.precio}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            precio: e.target.value,
                                        })
                                    }
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {form.tieneReceta && (
                        <div className="recipe-section">
                            <div className="recipe-header">
                                <label className="icon-label title">
                                    <Icons.ChefHat /> Ingredientes de la receta
                                </label>
                                <button
                                    type="button"
                                    className="btn-add-ingredient"
                                    onClick={handleAddIngredient}
                                >
                                    + Agregar Ingrediente
                                </button>
                            </div>

                            {form.ingredientes.map((ingrediente, idx) => (
                                <div key={idx} className="ingredient-row">
                                    <div className="custom-form-group">
                                        <label className="icon-label">
                                            Materia Prima{" "}
                                            <span className="required">*</span>
                                        </label>
                                        <select
                                            className="custom-input"
                                            value={ingrediente.idMateriaPrima}
                                            onChange={(e) =>
                                                handleIngredientChange(
                                                    idx,
                                                    "idMateriaPrima",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Seleccionar...
                                            </option>
                                            {materiasPrimas.map((mp) => (
                                                <option
                                                    key={mp.id}
                                                    value={mp.id}
                                                >
                                                    {mp.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="custom-form-group">
                                        <label className="icon-label">
                                            Cantidad{" "}
                                            <span className="required">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="custom-input"
                                            placeholder="Ej: 150"
                                            value={ingrediente.cantidad}
                                            onChange={(e) =>
                                                handleIngredientChange(
                                                    idx,
                                                    "cantidad",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-remove-ingredient"
                                        onClick={() =>
                                            handleRemoveIngredient(idx)
                                        }
                                    >
                                        <Icons.Trash />
                                    </button>
                                </div>
                            ))}

                            <p className="recipe-footer-text">
                                Debe agregar al menos un ingrediente para la
                                receta
                            </p>
                        </div>
                    )}

                    <div className="custom-form-actions">
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={submitting}
                        >
                            {submitting ? "Guardando..." : "Guardar producto"}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

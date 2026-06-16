import api from "./api";

export async function crearMateriaPrima(data) {
    const errors = validarCrearMateriaPrima(data);
    if (errors) return [null, errors];

    const res = await api.post(`/materias-primas`, data);

    return [res.data, null];
}

export function validarCrearMateriaPrima(data) {
    const errors = {};

    const camposNumericos = {
        stockInicial: "El stock inicial",
        stockMinimo: "El stock mínimo",
        cantidad_unidad: "La cantidad por unidad",
    };

    if (!data.nombre?.trim()) {
        errors.nombre = "El nombre es requerido";
    }

    if (!data.marca?.trim()) {
        errors.marca = "La marca es requerida";
    }

    for (const [campo, nombre] of Object.entries(camposNumericos)) {
        const valor = data[campo];

        if (valor === undefined || valor === null || valor === "") {
            if (campo !== "stockMinimo")
                errors[campo] = `${nombre} es requerido`;
        } else if (!Number.isInteger(valor)) {
            errors[campo] = `${nombre} debe ser un número entero`;
        } else if (valor < 0) {
            errors[campo] = `${nombre} no puede ser negativo`;
        }
    }

    return errors;
}

export async function getMateriasPrimas() {
    const res = await api.get("/inventario");
    return res.data;
}

export interface RecetaResponseDTO {
  producto: {
    id: number;
    nombre: string;
  };
  ingredientes: {
    materiaPrima: {
      id: number;
      nombre: string;
      unidad: string;
    };
    cantidad: number;
  }[];
}
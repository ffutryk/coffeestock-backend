export interface ComboResponseDTO {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    items: {
        producto: {
        id: number;
        nombre: string;
        };
        cantidad: number;
    }[];
}
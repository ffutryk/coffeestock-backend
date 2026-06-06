import { createContext, useContext, useState } from "react";
import Modal from "../components/modals/Modal";

const MODALES = {};

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [estado, setEstado] = useState(null);

    const abrir = (tipo, props = {}) => setEstado({ tipo, props });
    const cerrar = () => setEstado(null);

    const Contenido = estado ? MODALES[estado.tipo] : null;

    return (
        <ModalContext.Provider value={{ abrir, cerrar }}>
            {children}

            <Modal isOpen={!!estado} onClose={cerrar}>
                {Contenido && <Contenido {...estado.props} onClose={cerrar} />}
            </Modal>
        </ModalContext.Provider>
    );
}

export function useModal() {
    return useContext(ModalContext);
}

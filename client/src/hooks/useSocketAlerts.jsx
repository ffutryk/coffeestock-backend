import { useEffect } from "react";
import { toast } from "react-toastify";
import { socket } from "../services/socket";

const gravedadToToast = {
    CRITICA: toast.error,
    ALTA: toast.warning,
    MEDIA: toast.warning,
    BAJA: toast.info,
};

const gravedadToOptions = {
    CRITICA: { autoClose: false, icon: "🚨" },
    ALTA: { autoClose: 10000, icon: "⚠️" },
    MEDIA: { autoClose: 7000, icon: "📉" },
    BAJA: { autoClose: 5000, icon: "📦" },
};

export function useSocketAlerts() {
    useEffect(() => {
        socket.connect();

        const handleAlerta = (payload) => {
            const notify = gravedadToToast[payload.gravedad] ?? toast.info;
            const options = gravedadToOptions[payload.gravedad] ?? {};

            notify(payload.mensaje, {
                toastId: payload.id,
                ...options,
            });
        };

        socket.on("ALERTA_STOCK_BAJO", handleAlerta);

        return () => {
            socket.off("ALERTA_STOCK_BAJO", handleAlerta);
        };
    }, []);
}

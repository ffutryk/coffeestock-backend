import { useSocketAlerts } from "../hooks/useSocketAlerts";

export function AlertasListener() {
    useSocketAlerts();
    return null;
}

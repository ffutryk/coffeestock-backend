export default function MedioPagoSelect({ value, onChange, disabled }) {
  return (
    <div className="ev-section">
      <label className="ev-label">
        <span className="ev-label-icon">💳</span>
        Medio de pago <span className="ev-optional">(opcional)</span>
      </label>
      <select
        className="ev-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="EFECTIVO">Efectivo</option>
        <option value="TRANSFERENCIA">Transferencia</option>
        <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
        <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
      </select>
    </div>
  );
}

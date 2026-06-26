import './ProductComparisonChart.css';

export default function ProductComparisonChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        No hay datos disponibles para mostrar la comparativa
      </div>
    );
  }

  const maxUnidades = Math.max(...data.map(p => p.unidadesVendidas));

  return (
    <div className="product-comparison-chart">
      <div className="chart-bars">
        {data.map((prod) => {
          const barWidth = (prod.unidadesVendidas / maxUnidades) * 100;
          return (
            <div key={prod.id} className="chart-row">
              <div className="chart-label">{prod.nombre}</div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{ width: `${barWidth}%` }}
                >
                  <span className="chart-bar-value">{prod.cantidadVendida.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

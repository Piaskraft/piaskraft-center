export function DashboardPage() {
  return (
    <section className="dashboard-grid">
      <div className="dashboard-card">
        <span>Zadania dzisiaj</span>
        <strong>0</strong>
      </div>

      <div className="dashboard-card">
        <span>Produkty do sprawdzenia</span>
        <strong>0</strong>
      </div>

      <div className="dashboard-card">
        <span>Powiadomienia</span>
        <strong>0</strong>
      </div>

      <div className="dashboard-card">
        <span>Analizy eBay</span>
        <strong>0</strong>
      </div>
    </section>
  );
}
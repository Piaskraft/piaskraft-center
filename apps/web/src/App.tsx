import './App.css';

function App() {
  return (
    <main className="app">
      <section className="welcome-card">
        <p className="eyebrow">Piaskraft Center</p>

        <h1>Firmowe centrum pracy Piaskraft</h1>

        <p className="description">
          Panel do zadań, kalendarza, produktów roboczych, MJW → Presta Helper
          oraz eBay Assistant.
        </p>

        <div className="modules">
          <div>Dashboard</div>
          <div>Zadania</div>
          <div>Kalendarz</div>
          <div>Produkty robocze</div>
          <div>MJW → Presta Helper</div>
          <div>eBay Assistant</div>
        </div>
      </section>
    </main>
  );
}

export default App;
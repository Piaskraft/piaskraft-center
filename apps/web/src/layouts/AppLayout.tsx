import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './AppLayout.css';

const menuItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Zadania', path: '/zadania' },
  { label: 'Kalendarz', path: '/kalendarz' },
  { label: 'Produkty robocze', path: '/produkty-robocze' },
  { label: 'MJW → Presta Helper', path: '/mjw-presta-helper' },
  { label: 'eBay Assistant', path: '/ebay-assistant' },
  { label: 'Monitoring konkurencji', path: '/monitoring-konkurencji' },
  { label: 'Powiadomienia', path: '/powiadomienia' },
  { label: 'Baza wiedzy', path: '/baza-wiedzy' },
  { label: 'Ustawienia', path: '/ustawienia' },
  { label: 'Użytkownicy', path: '/uzytkownicy' },
];

const pageHeaders: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Dashboard',
    description: 'Centrum pracy Piaskraft — zadania, produkty i eBay.',
  },
  '/zadania': {
    title: 'Zadania',
    description: 'Zarządzanie pracą admina i operatora.',
  },
  '/kalendarz': {
    title: 'Kalendarz',
    description: 'Terminy, przypomnienia, telefony i spotkania.',
  },
  '/produkty-robocze': {
    title: 'Produkty robocze',
    description: 'Produkty przygotowywane do PrestaShop, eBay i BaseLinkera.',
  },
  '/mjw-presta-helper': {
    title: 'MJW → Presta Helper',
    description: 'Gotowe dane produktowe z MJW do ręcznego wklejenia w PrestaShop.',
  },
  '/ebay-assistant': {
    title: 'eBay Assistant',
    description: 'Dane do BaseLinkera, kalkulacja ceny i analiza eBay.de.',
  },
  '/monitoring-konkurencji': {
    title: 'Monitoring konkurencji',
    description: 'Śledzenie cen i jakości ofert konkurencji na eBay.de.',
  },
  '/powiadomienia': {
    title: 'Powiadomienia',
    description: 'Informacje o zadaniach, terminach, produktach i analizach.',
  },
  '/baza-wiedzy': {
    title: 'Baza wiedzy',
    description: 'Kategorie, prowizje, wysyłki, szablony i reguły SEO.',
  },
  '/ustawienia': {
    title: 'Ustawienia',
    description: 'Konfiguracja aplikacji, prowizji, wysyłek i danych firmy.',
  },
  '/uzytkownicy': {
    title: 'Użytkownicy',
    description: 'Role, dostępy i widoczność modułów.',
  },
};

export function AppLayout() {
  const location = useLocation();
  const currentHeader = pageHeaders[location.pathname] ?? pageHeaders['/'];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">P</span>
          <div>
            <strong>Piaskraft</strong>
            <small>Center</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'nav-item active' : 'nav-item'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <h1>{currentHeader.title}</h1>
            <p>{currentHeader.description}</p>
          </div>

          <div className="user-badge">
            <span>Admin</span>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { CalendarPage } from "./pages/CalendarPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { TasksPage } from "./pages/TasksPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="zadania" element={<TasksPage />} />
          <Route path="kalendarz" element={<CalendarPage />} />

          <Route
            path="produkty-robocze"
            element={
              <PlaceholderPage
                title="Produkty robocze"
                description="Produkty przygotowywane do PrestaShop, eBay i BaseLinkera."
              />
            }
          />

          <Route
            path="mjw-presta-helper"
            element={
              <PlaceholderPage
                title="MJW → Presta Helper"
                description="Operator wkleja link MJW, a aplikacja przygotowuje gotowe pola do PrestaShop."
              />
            }
          />

          <Route
            path="ebay-assistant"
            element={
              <PlaceholderPage
                title="eBay Assistant"
                description="Admin wkleja link Piaskraft, a aplikacja przygotowuje dane do BaseLinkera i eBay.de."
              />
            }
          />

          <Route
            path="monitoring-konkurencji"
            element={
              <PlaceholderPage
                title="Monitoring konkurencji"
                description="Śledzenie cen, jakości ofert i zmian konkurencji na eBay.de."
              />
            }
          />

          <Route path="powiadomienia" element={<NotificationsPage />} />

          <Route
            path="baza-wiedzy"
            element={
              <PlaceholderPage
                title="Baza wiedzy"
                description="Kategorie, prowizje eBay, cennik wysyłek, szablony opisów i reguły SEO."
              />
            }
          />

          <Route
            path="ustawienia"
            element={
              <PlaceholderPage
                title="Ustawienia"
                description="Konfiguracja aplikacji, prowizji eBay, wysyłek i danych firmowych."
              />
            }
          />

          <Route
            path="uzytkownicy"
            element={
              <PlaceholderPage
                title="Użytkownicy"
                description="Admin i operator: role, dostęp i widoczność modułów."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ReportPage } from "./pages/ReportPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="shell">
        <nav className="topbar">
          <Link to="/" className="brand">
            <span className="brand__mark" aria-hidden="true">E</span>
            Enfos <span className="brand__dim">Reporting</span>
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/reports/:reportId" element={<ReportPage />} />
          <Route
            path="*"
            element={
              <main className="page">
                <p>
                  That page doesn't exist. <Link to="/">Back to reports</Link>
                </p>
              </main>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

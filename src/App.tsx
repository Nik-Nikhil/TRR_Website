// App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";

import Teams from "./pages/Team";
import TeamDetail from "./pages/TeamDeatail";
import AdminsPage from "./pages/Admins";

import SchedulePage from "./pages/Schedule";

import AllPlayersPage from "./pages/Players/AllPlayersPage";
import PlayerDetailPage from "./pages/Players/PlayerDetailPage";

import RulesPage from "./pages/Rules";
import SeasonShowCase from "./pages/SeasonShowCase";

import GroupStage from "./pages/GroupStage";
import Playoff from "./pages/Playoff";

function App() {
  return (
    <div className="min-h-screen flex flex-col roshan-bg text-gray-100">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/admins" element={<AdminsPage />} />

          <Route path="/rules" element={<RulesPage />} />

          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />

          <Route path="/seasons" element={<SeasonShowCase />} />

          <Route path="/players" element={<AllPlayersPage />} />
          <Route path="/players/:playerId" element={<PlayerDetailPage />} />

          {/* NEW: Only the two pages you want */}
          <Route path="/group-stage/:season" element={<GroupStage />} />
          <Route path="/playoff/:season" element={<Playoff />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;

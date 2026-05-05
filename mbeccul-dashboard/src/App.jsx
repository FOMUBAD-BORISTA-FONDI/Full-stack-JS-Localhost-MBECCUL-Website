// src/App.jsx full routing table
import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
// import Accounts from "./pages/Accounts";
// import AccountDetail from "./pages/AccountDetail";
// import NewAccount from "./pages/NewAccount";
// import Transactions from "./pages/Transactions";
import NewTransaction from "./pages/NewTransaction";
// import Reports from "./pages/Reports";
// import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div style={{ display: "flex" }}>
      <Navbar />
      <main
        style={{ flex: 1, padding: "0", overflowY: "auto", minHeight: "100vh" }}
      >
        <Routes>
          {/* Public */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* All bank pages are protected */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/accounts" element={<Accounts />} /> */}
            {/* <Route path="/accounts/new" element={<NewAccount />} /> */}
            {/* <Route path="/accounts/:id" element={<AccountDetail />} /> */}
            {/* <Route path="/transactions" element={<Transactions />} /> */}
            <Route path="/transactions/new" element={<NewTransaction />} />
            {/* <Route path="/reports" element={<Reports />} /> */}
          {/* </Route> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>
    </div>
  );
}

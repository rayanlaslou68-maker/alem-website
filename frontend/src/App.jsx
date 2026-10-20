import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/portal/Login.jsx';
import Dashboard from './pages/portal/Dashboard.jsx';
import EquipmentSpecs from './pages/portal/EquipmentSpecs.jsx';
import Documents from './pages/portal/Documents.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portal/login" element={<Login />} />
          <Route
            path="/portal"
            element={
              <ProtectedRoute roles={['military', 'authority', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/equipment"
            element={
              <ProtectedRoute roles={['military', 'authority', 'admin']}>
                <EquipmentSpecs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/documents"
            element={
              <ProtectedRoute roles={['military', 'authority', 'admin']}>
                <Documents />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
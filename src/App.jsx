import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Register from './pages/Register';
import Login from './pages/Login';
import { PageAchat } from './pages';
// ... autres imports

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* ... autres routes */}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}


const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/achat" element={<PageAchat />} />
            {/* Ajoutez d'autres routes ici si nécessaire */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

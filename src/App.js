import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LeftNav from "./components/LeftNav";
import { useState } from "react";

function App() {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <BrowserRouter>
      <div className="d-flex">
        <LeftNav
          showMobileNav={showMobileNav}
          setShowMobileNav={setShowMobileNav}
        />
        <div className="center-section">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  showMobileNav={showMobileNav}
                  setShowMobileNav={setShowMobileNav}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

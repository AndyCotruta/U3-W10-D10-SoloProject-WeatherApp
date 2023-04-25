import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LeftNav from "./components/LeftNav";
import { useState } from "react";
import { Helmet } from "react-helmet";

function App() {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <BrowserRouter>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Weather App</title>
        <link rel="canonical" href="http://mysite.com/example" />
        <meta name="description" content="Nested component" />
      </Helmet>
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

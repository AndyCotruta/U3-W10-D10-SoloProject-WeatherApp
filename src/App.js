import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LeftNav from "./components/LeftNav";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex">
        {" "}
        <LeftNav />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

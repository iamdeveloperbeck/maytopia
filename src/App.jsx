import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Menyu from "./pages/Menyu";
import Comment from "./pages/Comment";

function App() {
  return (
    <Routes>
      <Route path="/visit/:type" element={<Home />} />
      <Route path="/menu" element={<Menyu />} />
      <Route path="/comment/:type" element={<Comment />} />
      <Route path="/comment/:type/:stol" element={<Comment />} />
    </Routes>
  );
}

export default App;

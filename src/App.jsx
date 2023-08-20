import styles from "./App.module.scss";
import Signup from "./components/Signup";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import { useEffect } from "react";
function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;

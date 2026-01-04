import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import AnalysePage from "./pages/AnalysePage"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyse" element={<AnalysePage />} />
      </Routes>
    </Router>
  )
}

export default App

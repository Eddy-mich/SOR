import { BrowserRouter, Route, Routes } from "react-router-dom";


import Index from "./pages/index.tsx";
import PollPage from "./pages/poll.tsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/poll/:selectedPoll" element={<PollPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

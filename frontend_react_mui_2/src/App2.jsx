import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import TwoColumnPage from "./pages/TwoColumnPage";

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<div>Witaj na stronie głównej</div>} />
          <Route path="/two-columns" element={<TwoColumnPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;

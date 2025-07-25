import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ModelViewer from './components/ModelViewer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/viewer/:id" element={<ModelViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
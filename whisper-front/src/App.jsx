import SampleHome from './components/SampleHome/SampleHome';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeMock } from './services/mock/mock';

function App() {

  initializeMock();

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route  path="/" element={<SampleHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

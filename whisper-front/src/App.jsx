import SampleHome from './components/SampleHome/SampleHome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route path='/' element={<SampleHome />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App

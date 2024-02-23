import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
const App=(route) => {
  return (
  
    
    <BrowserRouter>
    
    <Routes>
      <Route path="" element={<Home/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/Onboarding" element={<Onboarding/>}/>
    </Routes>
    </BrowserRouter>
    
  
  );
}

export default App;

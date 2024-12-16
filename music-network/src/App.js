import logo from './logo.svg';
import './App.css';
import Login from './pages/login/Login';
import Register from './pages/register/Register'
import {Routes,Route, Router, BrowserRouter} from 'react-router-dom'


function App() {
  return (
  //  <div className="App">
  //    <Login/>
  //    <Route path="/dashboard" component={Dashboard} />
  //  </div>

  <BrowserRouter>
    
       <main className="py-1">
       <Routes>            
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
      
      </main>
    </BrowserRouter>
  );
}

export default App;

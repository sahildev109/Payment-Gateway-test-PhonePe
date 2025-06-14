import HeroPage from "./pages/heroPage"
import { Routes, Route } from 'react-router-dom';
import AuthPage from "./pages/AuthPage"
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import AuthServices from "./services/AuthServices";
import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import PaymentStatus from "./pages/PaymentStatus";



function App() {
  //protected route
  // const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading state

  // useEffect(() => {
  //   const verifyAuth = async () => {
  //     try {
  //       const response = await AuthServices.checkAuth();
  //       if (response.isAuthenticated) {
  //         setIsAuthenticated(true);
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       console.error('Error checking auth:', error);
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   verifyAuth();
  // }, []);

   
  return (
    <AuthProvider>
      
    <Routes>
      <Route path="/dashboard" element={<HeroPage />} />
      <Route path="/" element={<AuthPage />} />
     
<Route path="/payment" element={<PaymentStatus />} />
    </Routes>
    <ToastContainer />
    </AuthProvider>
  )
}

export default App

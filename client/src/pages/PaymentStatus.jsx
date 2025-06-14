// PaymentStatus.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'success') {
      // Show toast and immediately redirect
      toast.success('Payment Successful!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      navigate('/dashboard'); // Immediate redirect
    }
  }, [status, navigate]);

  // Return null or empty container since we don't want to show anything
  return null;
};

export default PaymentStatus;
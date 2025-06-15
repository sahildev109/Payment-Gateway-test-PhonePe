import React, { useEffect, useState } from 'react';
import PaymentServices from '../services/PaymentServices';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import AuthServices from '../services/AuthServices';

const CourseCard = ({ course }) => {
   const [user,setUser]=useState(null);
  const [loading, setLoading] = useState(false)

 useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const response = await AuthServices.checkAuth();
                if (response.isAuthenticated) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setLoading(false );
            }
        };
        checkAuth();
    }, []);

  const { 
    _id,
    title, 
   description,
    price,
    imageUrl
  } = course;

  const data = {
        courseId: _id,
        userId: user?.id,
        name: user?.name,
        email: user?.email,
        amount: price ,
        number: '9999999999',
        MUID: "MUID" + Date.now(),
        transactionId: `T_${Date.now()}`,
    }

    const handleEnroll = async(e) => {
e.preventDefault();
try {
    const res = await PaymentServices.createOrder(data);
    console.log('Enrollment response:', res);
  if (res.data && res.data.instrumentResponse.redirectInfo.url) {
                window.location.href = res.data.instrumentResponse.redirectInfo.url;
            }
    
} catch (error) {
        console.error('Error during enrollment:', error);
    }
    

    }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Course Thumbnail */}
      <div className="relative pb-[56.25%] h-0 overflow-hidden">
        <img 
          src={imageUrl || 'https://via.placeholder.com/400x225'} 
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {price === 0 ? (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            FREE
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
            ₹{price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{title}</h3>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{description}</p>


        

          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors hover:cursor-pointer hover:border-1 border-blue-600 rounded-2xl p-2" onClick={handleEnroll}>
            Enroll Now
          </button>
        
      </div>
    </div>
  );
};

export default CourseCard;
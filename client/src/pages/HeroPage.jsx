import React from 'react'
import AuthServices from '../services/AuthServices'
import { AuthContext } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { useContext } from 'react';
import CoursesServices from '../services/CoursesServices';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const HeroPage = () => {
    const [courses, setCourses] = React.useState([]);
    const [user , setUser]=useState(null);
    const [loading1, setLoading1] = React.useState(false);
    const [loading2, setLoading2] = React.useState(false);
       const navigate=useNavigate();

     useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading1(true);
        const data = await CoursesServices.getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading1(false);
      }
    };

    fetchCourses();
  }, []);



  
useEffect(() => {
  const checkAuth = async () => {
        try {
        setLoading2(true);
        const response = await AuthServices.checkAuth();
        console.log('Auth check response:', response);
        if (response.isAuthenticated) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        
      } finally {
        setLoading2(false);
      }
    };
    checkAuth();
  }, []);

  if (loading1 || loading2) {
    return <div>Loading...</div>;
  }

   if (!courses || courses.length === 0) {
     return <div>No courses found.</div>;
   }



    
  return (<>
  <div className='p-4'>

<div className='flex items-center justify-between mb-4'>

    <h1 className='text-2xl font-bold'> Hello! {user?.name}</h1>
    <button className='bg-blue-500 text-white px-4 py-2 rounded font-bold' onClick={() => navigate('/my-courses')}>My Courses</button>
</div>
    <h2 className='text-xl font-semibold mt-4'>Explore Courses</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-2">
      {courses.map(course => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  </div>

  </>
  )
}

export default HeroPage
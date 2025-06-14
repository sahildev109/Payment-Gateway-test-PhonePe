import React from 'react'
import AuthServices from '../services/AuthServices'
import { AuthContext } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { useContext } from 'react';
import CoursesServices from '../services/CoursesServices';
import { useEffect } from 'react';

const HeroPage = () => {
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

     useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await CoursesServices.getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

   if (loading) {
     return <div>Loading...</div>;
   }

   if (!courses || courses.length === 0) {
     return <div>No courses found.</div>;
   }

  
    const { user } = useContext(AuthContext);

    const checkAuth = async () => {
        try {
        const response = await AuthServices.checkAuth();
        console.log('Auth check response:', response);
        } catch (error) {
        console.error('Error checking auth:', error);
        }
    };

  return (<>
  <div className='p-4'>


    <h1 className='text-2xl font-bold'> Hello! {user?.name}</h1>
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
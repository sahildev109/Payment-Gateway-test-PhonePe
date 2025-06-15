import { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard";
import AuthServices from "../services/AuthServices";

const MyCourses = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState({
        auth: false,
        courses: false
    });

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(prev => ({ ...prev, auth: true }));
                const response = await AuthServices.checkAuth();
                if (response.isAuthenticated) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setLoading(prev => ({ ...prev, auth: false }));
            }
        };
        checkAuth();
    }, []);

    // Fetch courses when user is available
    useEffect(() => {
        if (!user?.id) return;

        const fetchCourses = async () => {
            try {
                setLoading(prev => ({ ...prev, courses: true }));
                const response = await AuthServices.getUserById(user.id);
                setCourses(response.purchasedCourses || []);
                console.log("Fetched courses:", response.purchasedCourses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(prev => ({ ...prev, courses: false }));
            }
        };

        fetchCourses();
    }, [user?.id]);

    if (loading.auth || loading.courses) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please log in to view your courses</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4 mt-4">My Courses</h1>
            {courses.length > 0 ? (
                
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-2">
                    {courses.map(course => (
                        <div key={course._id }>  {/* Fixed: Added key prop */}
                          <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            ) : (
                <p>No courses purchased yet</p>
            )}
        </div>
    );
};

export default MyCourses;
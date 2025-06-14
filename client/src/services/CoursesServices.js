const API_URL = 'http://localhost:3000/api/courses';

const getCourses = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' 
  });
  return response.json();
}

const getCourseById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });
  return response.json();
}

export default {
  getCourses,
  getCourseById
};
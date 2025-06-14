const API_URL = 'http://localhost:3000/api/order';


const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
   
  });
  return response.json();
}


export default {
  createOrder,
};

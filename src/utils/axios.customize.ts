import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BACKEND}`
});

// Add a request interceptor to attach an auth token
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('authToken'); // Get token from local storage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach it to the Authorization header
    }
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(function onFulfilled(response) {
    // Do something with response data
    // Otherwise, return the full response object
    // console.log(response.data)
    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error, e.g., handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Redirect to login page or handle token refresh
      console.log('Unauthorized request. Redirecting to login.');
      // Example: window.location.href = '/login';
    }
    return Promise.reject(error);
  });


export default instance;
// A configuration object that holds values for different environments.
const config = {
  // development: {
  //   API_BACKEND: 'http://localhost:3001/api'
  // },
  production: {
    API_BACKEND: 'https://1314f0c97b45.ngrok-free.app/api' // Example production URL
  }
};

// Check for the NODE_ENV environment variable, defaulting to 'development'.
const environment ='production';

// Get the API backend URL from the config object using the environment key.
const api_backend = config[environment].API_BACKEND;

// Export the variable for use in other files.
export {
  api_backend
};
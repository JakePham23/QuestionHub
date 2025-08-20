  // A configuration object that holds values for different environments.


  const config = {
    development: {
      API_BACKEND: 'https://462cb74ef07d.ngrok-free.app/api'
    },
    production: {
    API_BACKEND: `${process.env.NEXT_PUBLIC_API_BACKEND}/api`
    }
  };

  // Check for the NODE_ENV environment variable, defaulting to 'development' if not set.
  const environment = process.env.NODE_ENV || 'development';

  // Get the API backend URL from the config object using the determined environment key.
const api_backend = config[environment as 'development' | 'production'].API_BACKEND;

  // Export the variable for use in other files.
  export {
    api_backend
  };
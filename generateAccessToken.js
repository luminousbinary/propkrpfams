require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

// Retrieve clientId and clientSecret from environment variables
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Ensure both clientId and clientSecret are provided
if (!clientId || !clientSecret) {
  console.error('Error: CLIENT_ID and CLIENT_SECRET must be set in the .env file');
  process.exit(1);
}

// Generate the Base64-encoded string
const authHeader = `Basic ${Buffer.from(`IKIA72C65D005F93F30E573EFEAC04FA6DD9E4D344B1:YZMqZezsltpSPNb4+49PGeP7lYkzKn1a5SaVSyzKOiI=`).toString('base64')}`;

// Define the request options
const requestOptions = {
  method: 'post',
  url: 'https://sandbox.interswitchng.com/passport/oauth/token',
  headers: {
    'Authorization': authHeader,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: qs.stringify({
    'grant_type': 'client_credentials'
  })
};

// Make the request
axios(requestOptions)
  .then(response => {
    console.log('Access Token:', response.data.access_token);
  })
  .catch(error => {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
  });

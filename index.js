require('dotenv').config();
const express = require('express');
const axios = require('axios');
const qs = require('qs');
const bs64token = require('./generateAccessToken')
const app = express();
const port = 3000;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const bs64 = bs64token;
const getAccessToken = async () => {



// Ensure both client_id and client_secret are provided
if (!client_id || !client_secret) {
    console.error('Error: CLIENT_ID and CLIENT_SECRET must be set in the .env file');
    process.exit(1);
  }
  
  // Generate the Base64-encoded string
  const authHeader = await `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`;
  console.log("ok" , authHeader);
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

  console.log("ök too", requestOptions);
  
  // Make the request
 await axios(requestOptions)
    .then(response => {
      console.log('Access Token:', response.data.access_token)
      return response.data.access_token;
    })
    .catch(error => {
        console.log(error);
      console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    });


//   try {
//     const response = await axios.post(tokenUrl, data, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': authHeader
//       }
//     });
//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error getting access token:', error.response ? error.response.data : error.message);
//     throw error;
//   }
};

const fetchBillers = async (accessToken) => {
  const billersUrl = 'https://sandbox.interswitchng.com/api/v2/quickteller/categorys'; // Replace with the correct endpoint for production

  try {
    const response = await axios.get(billersUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching billers:', error.response ? error.response.data : error.message);
    throw error;
  }
};

app.get('/billers', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const billers = await fetchBillers(accessToken);
    res.json(billers);
  } catch (error) {
    console.error('Error in /billers endpoint:', error.response ? error.response.data : error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

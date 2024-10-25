// Import dotenv to load .env variables
require('dotenv').config();
const axios = require('axios');
const https = require('https');

// Access environment variables correctly
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

// Force TLS 1.2
https.globalAgent.options.secureProtocol = 'TLSv1_2_method';

// Function to get the auth token
async function getAuthToken() {
  try {
    const response = await axios.post('https://therangeadmin.excitare.ai/login', {
      username,
      password
    });
    return response.data.authToken;
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to fetch policy data
async function fetchPolicyData(authToken) {
  try {
    const response = await axios.post(
      'https://therangeadmin.excitare.ai/ext/auth/underwriteapiV1/fetch-policy-by-date',
      {
        fromDate: '2024-04-30',
        toDate: '2024-09-30'
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching policy data:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Main function to get the token and fetch policy data
async function main() {
  try {
    const authToken = await getAuthToken();
    const policyData = await fetchPolicyData(authToken);

    // Log the full JSON response
    console.log('Policy Data:', JSON.stringify(policyData, null, 2));
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();

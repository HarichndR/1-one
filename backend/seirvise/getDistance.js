const axios = require('axios');
const fs = require('fs');

async function getDistanceMatrix(source, destination, apiKey) {
    try {
        // URL variable to store the API endpoint
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(source)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

        // Send GET request using Axios
        const response = await axios.get(url);

        // Extract JSON data from response
        const data = response.data;

        // Return the data
        return data;
    } catch (error) {
        // If there's an error, log and return null
        console.error('Error:', error.message);
        return null;
    }
}

// Example usage:
/*const apiKey = 'AIzaSyC8k2UoaaU5gcnnNsJu1ujPhDmHRdSbj7I';
const source = 'borale'; // Replace 'Source address' with your actual source address
const destination = 'dhule'; // Replace 'Destination address' with your actual destination address*/

module.exports={getDistanceMatrix}/*(source, destination, apiKey)
  .then(data => {
    if (data) {
      console.log(data);
      // Process the data as needed
    } else {
      console.log('Error fetching distance matrix data.');
    }
  });
*/

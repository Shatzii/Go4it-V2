import axios from 'axios';

async function clearAnimationJobs() {
  try {
    const response = await axios.delete('http://localhost:5000/api/animations/debug/jobs', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('Clear jobs response:', response.data);
    
    // Verify jobs are cleared
    const checkResponse = await axios.get('http://localhost:5000/api/animations/debug/jobs', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('Jobs after clearing:', checkResponse.data);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

clearAnimationJobs();
const axios = require('axios');

async function test() {
  const url = 'https://www.tiktok.com/@stelancuek757/video/7625524763527580936';

  console.log('Testing tikwm.com...');
  try {
    const res = await axios.post(
      'https://www.tikwm.com/api/',
      new URLSearchParams({ url, hd: '1' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.tikwm.com/',
        },
        timeout: 15000
      }
    );
    console.log('Status HTTP:', res.status);
    console.log('Response data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('ERROR:', err.message);
    if (err.response) {
      console.error('HTTP Status:', err.response.status);
      console.error('Response:', err.response.data);
    }
  }
}

test();
const axios = require('axios');
require('dotenv').config();

async function downloadTikTok(url) {
  try {
    // API tikwm - gratis & tanpa watermark
    const res = await axios.post(
      'https://api.tikwmapi.com',
      new URLSearchParams({ url, hd: 1 }),
      { headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        'x-tikwmapi-key': process.env.TIKWM_API_KEY
        } 
      }
    );

    const data = res.data?.data;
    if (!data) throw new Error('Gagal mengambil data');

    return {
      title: data.title || 'TikTok Video',
    //   videoUrl: data.hdplay || data.play,  // HD dulu, fallback SD
      videoUrl: data.play,  // HD dulu, fallback SD
      author: data.author?.nickname || 'Unknown',
      likes: data.digg_count,
    };
  } catch (err) {
    throw new Error('Download gagal: ' + err.message);
  }
}

module.exports = { downloadTikTok };
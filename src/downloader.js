const axios = require('axios');
require('dotenv').config();

const isM4a = (url) => url && url.endsWith('.m4a');

async function downloadTikTok(url) {
  const res = await axios.post(
    'https://api.tikwmapi.com',
    new URLSearchParams({ url, hd: 1 }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-tikwmapi-key': process.env.TIKWM_API_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://tikwm.com',
        'Referer': 'https://tikwm.com/',
      },
    }
  );

  const data = res.data?.data;
  if (!data) throw new Error('Gagal mengambil data');

  const isImage = data.type === 'image' || (data.images && data.images.length > 0);

  let videoUrl = null;
  if (!isImage) {
    videoUrl = data.hdplay || data.play || data.wmplay;
    if (isM4a(videoUrl)) videoUrl = data.play;
    if (isM4a(videoUrl)) videoUrl = data.wmplay;
    if (isM4a(videoUrl)) videoUrl = null;
  }

  return {
    type: isImage ? 'image' : (videoUrl ? 'video' : 'audio'),
    title: data.title || (isImage ? 'TikTok Foto' : 'TikTok Video'),
    videoUrl,
    images: isImage ? data.images : null,
    author: data.author?.nickname || 'Unknown',
    likes: data.digg_count,
  };
}

module.exports = { downloadTikTok };
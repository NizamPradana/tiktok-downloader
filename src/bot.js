require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { downloadTikTok } = require('./downloader');
<<<<<<< HEAD
// Di bot.js untuk production
const bot = new TelegramBot(process.env.BOT_TOKEN);
bot.setWebHook(`${process.env.APP_URL}/bot${process.env.BOT_TOKEN}`);


// const bot = new TelegramBot(process.env.BOT_TOKEN, {
//   polling: true   // ganti 'webhook' saat production
// });
=======

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true   // ganti 'webhook' saat production
});
>>>>>>> 36a694a764263268d74281d04813756e1bd5224f

// Command /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    '👋 Halo! Kirimkan link TikTok dan saya akan\n' +
    'mendownloadnya *tanpa watermark* untuk kamu! 🎬\n\n' +
    'Contoh: https://www.tiktok.com/@user/video/...',
    { parse_mode: 'Markdown' }
  );
});

// Tangkap URL TikTok
bot.onText(/https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\S+/,
async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[0];

  const status = await bot.sendMessage(chatId,
    '⏳ Memproses video, mohon tunggu...'
  );

  try {
    const video = await downloadTikTok(url);

    const fileOptions = {
        // Explicitly specify the file name.
        filename: video.videoUrl,
        // Explicitly specify the MIME type.
        contentType: 'video/mp4'
    };
    await bot.sendVideo(chatId, video.videoUrl, {
      caption: `🎬 *${video.title}*\n👤 ${video.author}\n❤️ ${video.likes?.toLocaleString()} likes`,
      parse_mode: 'Markdown',
      supports_streaming: true
    }, fileOptions);

    bot.deleteMessage(chatId, status.message_id);
  } catch (err) {
    console.log(err.response?.data);
    bot.editMessageText(
      '❌ Gagal download. Pastikan link valid dan coba lagi.',
      { chat_id: chatId, message_id: status.message_id }
    );
  }
});

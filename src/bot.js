require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { downloadTikTok } = require('./downloader');


const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    '👋 Halo! Kirimkan link TikTok dan saya akan\n' +
    'mendownload *video* 🎬 maupun *foto* 🖼️ tanpa watermark!\n\n' +
    'Contoh: https://www.tiktok.com/@user/video/...',
    { parse_mode: 'Markdown' }
  );
});

bot.onText(/https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\S+/,
async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[0];

  const status = await bot.sendMessage(chatId,
    '⏳ Memproses, mohon tunggu...'
  );

  try {
    const result = await downloadTikTok(url);
    await bot.deleteMessage(chatId, status.message_id).catch(() => {});

    const caption = `🖼️ *${result.title}*\n👤 ${result.author}\n❤️ ${result.likes?.toLocaleString()} likes`;

    if (result.type === 'image') {
      const media = result.images.slice(0, 10).map((url, i) => ({
        type: 'photo',
        media: url,
        caption: i === 0 ? caption : undefined,
        parse_mode: 'Markdown',
      }));
      await bot.sendMediaGroup(chatId, media);
    } else if (result.type === 'video' && result.videoUrl) {
      await bot.sendVideo(chatId, result.videoUrl, {
        caption,
        supports_streaming: true,
        parse_mode: 'Markdown',
      });
    } else {
      await bot.sendMessage(chatId,
        '❌ Postingan ini hanya berisi audio dan tidak dapat dikirim.',
      );
    }
  } catch (err) {
    console.error(err.response?.data || err.message);

    bot.editMessageText(
        '❌ Gagal download. Pastikan link valid dan coba lagi.',
        {
        chat_id: chatId,
        message_id: status.message_id
        }
    ).catch(() => {});
  }
});

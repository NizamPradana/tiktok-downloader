require('./src/bot');
<<<<<<< HEAD

// Tambahkan express untuk handle webhook
const express = require('express');
const app = express();
app.use(express.json());
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
  console.log('🤖 Bot TikTok Downloader aktif!');
});
app.listen(process.env.PORT || 3000);
=======
console.log('🤖 Bot TikTok Downloader aktif!');
>>>>>>> 36a694a764263268d74281d04813756e1bd5224f

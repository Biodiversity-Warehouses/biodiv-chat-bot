'use strict';
const BootBot = require('bootbot');

const port = process.env.PORT | 3000;

const bot = new BootBot({
  accessToken: process.env.TOKEN,
  verifyToken: process.env.VERIFY,
  appSecret: process.env.APP_SECRET
});

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  chat.say(`Echo: ${text}`);
});

bot.start(port);
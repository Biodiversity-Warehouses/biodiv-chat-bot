const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('messenger-bot');

let port = process.env.PORT || 8080;

let bot = new Bot({
  token: process.env.TOKEN,
  verify: process.env.VERIFY,
  app_secret: process.env.APP_SECERT
});

bot.on('error', (err) => {
  console.log(err.message)
});

bot.on('message', (payload, reply) => {
  let text = payload.message.text;

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err;

    reply({ text }, (err) => {
      if (err) throw err;

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  return bot._verify(req, res)
});


app.get('/hello', (req, res) => {
  return res.send(JSON.stringify({status: 'hello'}))
});



app.post('/', (req, res) => {
  bot._handleMessage(req.body);
  res.end(JSON.stringify({status: 'ok'}))
});

http.createServer(app).listen(port, ()=>{
  console.log("Server is up and running on port: " + port)
});
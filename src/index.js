const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('messenger-bot');
const Conversation = require('./conversation.js');


const port = process.env.PORT || 8080;
const conversation = new Conversation.Conversation();

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
    console.log("New Message from user ", text);
    let { answer, answerOptions}= conversation.processMessage(text);
    console.log("Got answer from processMessage: ", answer,answerOptions);
    let quick_replies = answerOptions.map((optionStr)=>{
      //Quick replies see: https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
      return    {
        "content_type":"TEXT",
        "title":optionStr,
        "payload":optionStr.toUpperCase()
      }
    });
    let response = { text: answer, quick_replies: quick_replies };
    console.log("Send response  ", answer,answerOptions);
    reply({ text: answer, quick_replies: quick_replies }, (err) => {
      console.log("Error:", err);
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

/*
console.log(conversation.processMessage("Test").answer);
console.log(conversation.processMessage("hilfe").answer);
console.log(conversation.processMessage("wo").answer);
console.log(conversation.processMessage("bla-bla-bla").answer);
console.log(conversation.processMessage("ja").answer);
console.log(conversation.processMessage("wo").answer);

*/

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('messenger-bot');
const Conversation = require('./conversation.js');


const port = process.env.PORT || 8080;
const bioDivUser = process.env.BIODIV_USER || "your biodiv user ";
const bioDivPassword = process.env.BIODIV_PASSWORD || "your biodiv pass";
const conversations = {};

function removeOldConversation() {

  setInterval(() => {
    Object.keys(conversations)
        .map((key) => {
          return {key: key, value: conversations[key]}
        })
        .filter((keyValue) => keyValue.value.isActive())
        .forEach((keyValue) => {
          delete conversations[keyValue.key]
        })
  }, 1000 * 60 * 5)
}
let bot = new Bot({
  token: process.env.TOKEN,
  verify: process.env.VERIFY,
  app_secret: process.env.APP_SECERT
});

bot.on('error', (err) => {
  console.log(err.message)
});

bot.on('message', (payload, reply) => {
  console.log("new Palyload", payload);

  let text = payload.message.text ? payload.message.text : "";
  console.log(payload.message.attachments);
  let senderId = payload.sender.id;
  //Create new converstation if necessar

  api.login(bioDivUser, bioDivPassword).then((result) => {
    "use strict";
    let accessToken = result.accessToken;
    api.getSpeciesList(accessToken).then((species) => {

      console.log(species);
      if (!conversations.hasOwnProperty(senderId)) {
        conversations[senderId] = new Conversation(species);
      }
      let conversation = conversations[senderId];


      bot.getProfile(senderId, (err, profile) => {
        if (err) throw err;
        console.log("New Message from user ", text);
        console.log("converstaion object", conversation);
        if(payload.message.attachments){
          let first = payload.message.attachments.pop();
          let location = first.payload.coordinates;
          conversation.setLocation(location);
          text = "Location set"
        }


        let result = conversation.processMessage(text);
        let answer = result.answer;
        let answerOptions = result.answerOptions ? result.answerOptions : [];
        let locationRequest = result.locationRequest ? result.locationRequest :false;
        console.log("Got answer from processMessage: ", answer, answerOptions);
        let quick_replies = answerOptions.map((optionStr) => {
          //Quick replies see: https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
          return {
            "content_type": "TEXT",
            "title": optionStr,
            "payload": optionStr.toUpperCase()
          }
        });


        let response = {text: answer};
        if (quick_replies.length > 0) {
          response.quick_replies = quick_replies
        }
        if(locationRequest){
          response.quick_replies = [{
              "content_type":"location"
          }]
        }
        console.log("Send response  ", answer, answerOptions);
        reply(response, (err) => {
          console.log("Error:", err);
          if (err) throw err;

          console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
        })
      })

    });
    console.log(result.accessToken)
  }).catch((err) => {
    "use strict";
    console.log(err)
  });

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

http.createServer(app).listen(port, () => {
  console.log("Server is up and running on port: " + port)
  removeOldConversation()
});


const Api = require("./api");

let api = new Api();

/*

 let conversation = new Conversation();
 console.log(conversation.processMessage("Test").answer);
 console.log(conversation.processMessage("hilfe").answer);
 console.log(conversation.processMessage("wo").answer);
 console.log(conversation.processMessage("bla-bla-bla").answer);
 console.log(conversation.processMessage("ja").answer);
 console.log(conversation.processMessage("wo").answer);

 */
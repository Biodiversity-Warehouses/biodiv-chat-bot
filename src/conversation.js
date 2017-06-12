var Conversation = function (speciesList) {
  this.lastAnswer = null;
  this.lastAction = Date.now();
  this.firstmessage = true;
  this.inFindingProcess = false;

  this.speciesList = speciesList;

  let commonNames = speciesList.map((obj) => obj.commonName);
  let scientificNames = speciesList.map((obj) => obj.scientificName);
  this.speciesNames = commonNames.concat(scientificNames);

  this.location = null;
  this.species = null;
  this.date = Date.now();

  this.isActive = function () {
    let diff = this.lastAction - Date.now();
    let fiveMinInMs = 1000 * 60 * 5;
    return diff <= fiveMinInMs;

  };
  this.setLocation = function (location) {
    this.location = location
  };
  this.setSpeciesById = function(speciesId){
    "use strict";
    this.species  = this.speciesList.find((item)=>item.id === speciesId)
  };
  this.processMessage = function (message) {
    console.log("Input> " + message);
    this.lastAction = Date.now();
    var splitedMessage = message.split(/[ ,]+/);

    if (this.firstmessage || match(splitedMessage, ["hey", "moin", "hallo", "hi", "servus"])) {
      this.firstmessage = false;
      var startText = 'Hey du, ich bin BioDiv und kann weiterhelfen, wenn du seltene Muscheln / Säugetiere oder Fische in deiner Umgebung gesichtet hast. ';

      var answerOptions = ["Hilfe", "Fund melden"];

      return {answer: startText, answerOptions: answerOptions};
    }
    let yes = ["ja", "ok", "jo", "jup"];
    let no = ["nein", "nö", "ne", "auf gar keinen fall", "halt die fresse"];

    if (match(splitedMessage, yes.concat(no))) {
      var userAnswer = message;
      var answerOptions = [];

      this.lastAnswer = null;
      if (match(splitedMessage, yes)) {
        var jaText = "Ich halte Dich auf dem Laufenden. 👍";
        return {answer: jaText, answerOptions: answerOptions};
      } else {
        var neinText = "Ok, frag' einfach, wenn du wissen willst, wie der Status ist. 😁 Ich bin bis auf weiteres stumm. 🙈🙊🙉";
        return {answer: neinText, answerOptions: answerOptions};
      }

    }

    if (match([message], ["Fund melden"])) {
      var answerOptions = [];

      var helpText = 'ℹ️ Alles klar du, dann lass uns loslegen und deinen Fund zusammen aufnehmen! \n \n Schreibe mir einfach was du gesehen hat.';

      this.inFindingProcess = true;

      return {answer: helpText, answerOptions: answerOptions};
    }

    if (this.inFindingProcess) {

      console.log(splitedMessage);
      console.log(this.speciesCommonNames);
      console.log(this.speciesSientificNames);

      if (match([message], ["Location set"])) {
        return {
          answer: "Nun weiß ich schon wo du dich befindest, Vielleicht möchtest du noch mehr angeben?",
          answerOptions: ["Nachweisquallität", "Nachweismethode", "Fund speichern"]
        };
      }
      else if (match(splitedMessage, ["Nachweismethode"])) {
        return {
          answer: "Okay welche der folgenden Nachweismethoden wurde verwendet?",
          answerOptions: [""]
        };
      }
      else if (match(splitedMessage, ["Nachweisquallität"])) {
        return {
          answer: "Wie war die genaue Nachweisquallität?",
          answerOptions: ["Nachweisquallität", "Nachweismethode"]
        };
      }
      else if (match([message], this.speciesNames) || this.species!=null) {

        let potentialSpecies = this.speciesList.filter((species) => {

          let nameSplits = species.commonName.split(" ");
          nameSplits = nameSplits.concat(species.scientificName.split(" "));

          nameSplits = nameSplits.filter((name) => name.toLowerCase().trim() != "muschel" && name.toLowerCase().trim() != "mussel")
          nameSplits = nameSplits.filter((name) => name.toLowerCase().trim() != "clam");
          nameSplits = nameSplits.filter((name) => name.toLowerCase().trim() != "fisch" && name.toLowerCase().trim() != "fish")
          console.log("nameSplits", nameSplits);
          return match(splitedMessage, nameSplits)
        });

        console.log("potentialSpecies", potentialSpecies);

        if (potentialSpecies.length == 0 && this.species === null) {
          return {
            answer: "Irgendwas ist hier schief gelaufen :( Ich konnte irgendwie keine Spezies finden ... "
          };
        }
        else if (potentialSpecies.length == 1 || this.species != null) {
          if(potentialSpecies.length===1){
            this.species = potentialSpecies.pop()
          }
          return {
            answer: "Sehr schön, hab ich verstanden du hast " + this.species.commonName + " bei dir gesehen. " +
            "\n Es wäre super wenn du mir noch deinen Standort zeigen könntest?",
            locationRequest: true
          };
        } else {
          return {
            answer: "Huch da brauch ich noch ein wenig mehr Infos.\nEs gibt mehrere Spezies, bitte wähle die richtige aus: ",
            answerOptions: potentialSpecies.map((species) => species.commonName)
          };
        }


      }

      else if (this.speciesName == null) {

        console.log("Choose species text ", this.speciesCommonNames);


        let elements = this.speciesList.map((species) => {
          "use strict";

          return {
            title: species.commonName,
            subtitle: species.scientificName,
            item_url: species.links.self,
            image_url: species.imageUrl,
            buttons: [{
              type: "postback",
              title: "Ja, bin mir sicher!",
              payload: "SPECIES_ID-" + species.id,
              },
              {
              type: "postback",
              title: "Mhmm, am ehsten",
              payload: "SPECIES_ID-" + species.id,
            }],
          }
        });

        let attachment = {
          type: "template",
          payload: {
            template_type: "generic",
            elements: elements
          }
        };

        return {
          answer: "Leider habe ich dich nicht so recht verstanden, hier einige Vorschläge was für Spezies ich so im Angebot hätte",
          attachment: attachment
        }

      }

    }

    return {
      answer: "Ich konnte dich leider nicht verstehen... 😰",
      answerOptions: ["Hilfe"]
    }


  };

  return this;
};

function match(splitedMessage, keyWords) {

  for (var word in splitedMessage) {
    for (var keyWord in keyWords) {
      var lowerCaseWord = splitedMessage[word].toLowerCase();
      var lowerCaseKeyword = keyWords[keyWord].toLowerCase();

      if (lowerCaseWord == lowerCaseKeyword) {
        return true;
      }
    }
  }

  return false;
}


module.exports = Conversation;

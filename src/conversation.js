var Conversation = function(speciesList) {
	this.lastAnswer = null;
	this.lastAction = Date.now();
	this.firstmessage = true;
	this.inFindingProcess = false;

	this.speciesList = speciesList;

	let commonNames = speciesList.map((obj)=>obj.triname);
	let scientificNames = speciesList.map((obj)=>obj.sciname);
  this.speciesNames = commonNames.concat(scientificNames);

	this.location = null;
	this.species = null;

	this.isActive = function(){
			let diff = this.lastAction - Date.now();
			let fiveMinInMs = 1000 * 60 * 5;
			return diff <= fiveMinInMs;

	};
	this.setLocation = function(location){
		this.location = location
	};
	this.processMessage = function(message) {
		console.log("Input> " + message);
    this.lastAction = Date.now();
		var splitedMessage = message.split(/[ ,]+/);

		if(this.firstmessage || match(splitedMessage,["hey", "moin", "hallo", "hi", "servus"])) {
			this.firstmessage = false;
			var startText = 'Hey du, ich bin BioDiv und kann weiterhelfen, wenn du seltene Muscheln / Säugetiere oder Fische in deiner Umgebung gesichtet hast. ';

			var answerOptions = ["Hilfe", "Fund melden"];

			return { answer: startText, answerOptions: answerOptions };
		}
		let yes = ["ja", "ok", "jo", "jup"];
		let no = ["nein", "nö", "ne", "auf gar keinen fall", "halt die fresse"];

    if(match(splitedMessage, yes.concat(no))) {
			var userAnswer = message;
			var answerOptions = [];

			this.lastAnswer = null;
			if(match(splitedMessage, yes)) {
				var jaText = "Ich halte Dich auf dem Laufenden. 👍"; 
				return { answer: jaText, answerOptions: answerOptions };
			} else {
				var neinText = "Ok, frag' einfach, wenn du wissen willst, wie der Status ist. 😁 Ich bin bis auf weiteres stumm. 🙈🙊🙉";
				return { answer: neinText, answerOptions: answerOptions };
			}

		}

		if(match([message], ["Fund melden"])) {
			var answerOptions = [];

			var helpText = 'ℹ️ Alles klar du, dann lass uns loslegen und deinen Fund zusammen aufnehmen! Was für eine Spezies hast du denn gesehen?';

      this.inFindingProcess = true;

			return { answer: helpText, answerOptions: answerOptions };
		}

		if(this.inFindingProcess){

    	console.log(splitedMessage);
    	console.log(this.speciesCommonNames);
    	console.log(this.speciesSientificNames);

    	if(match([message],["Location set"])){
        return {
          answer: "Nun weiß ich schon wo du dich befindest, Vielleicht möchtest du noch mehr angeben?",
          answerOptions: ["Nachweisquallität", "Nachweismethode", "Fund speichern"]
        };
			}
			else if(match(splitedMessage,["Nachweismethode"])){
        return {
          answer: "Okay welche der folgenden Nachweismethoden wurde verwendet?",
          answerOptions: [""]
        };
			}
			else if(match(splitedMessage,["Nachweisquallität"])){
        return {
          answer: "Wie war die genaue Nachweisquallität?",
          answerOptions: ["Nachweisquallität", "Nachweismethode"]
        };
			}
    	else if(match([message],this.speciesNames)){

				let potentialSpecies = this.speciesList.filter((species)=> {

					let nameSplits = species.triname.split(" ");
					let nameSplits = nameSplits.concat(species.sciname.split(" "))

					console.log("nameSplits",nameSplits);
					return match(splitedMessage,nameSplits )
        });

				console.log("potentialSpecies", potentialSpecies);

				if(potentialSpecies.length == 0 ){
          return {
            answer: "Irgendwas ist hier schief gelaufen :( Ich konnte irgendwie keine Spezies finden ... "
          };
				}
				else if (potentialSpecies.length == 1 ){
          return {
            answer: "Sehr schön, hab ich verstanden du hast " + message + " bei dir gesehen. " +
            "\n Es wäre super wenn du mir noch deinen Standort zeigen könntest?"
          };
				}else {
          return {
            answer: "Huch da brauch ich noch ein wenig mehr Infos.\nEs gibt mehrere Spezies, bitte wähle die richtige aus: ",
            answerOptions: potentialSpecies.map((species)=>species.triname)
          };
				}



			}

    	else if(this.speciesName == null){

        console.log("Choose species text ", this.speciesCommonNames);
        return {
          answer: "Leider habe ich dich nicht so recht verstanden, hier einige Vorschläge was für Spezies ich so im Angebot hätte",
          answerOptions: this.speciesCommonNames
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

	for(var word in splitedMessage) {
		for(var keyWord in keyWords) {
			var lowerCaseWord = splitedMessage[word].toLowerCase();
			var lowerCaseKeyword = keyWords[keyWord].toLowerCase();

			if(lowerCaseWord == lowerCaseKeyword) {
				return true;
			}
		}
	}

	return false;
}


module.exports = Conversation;

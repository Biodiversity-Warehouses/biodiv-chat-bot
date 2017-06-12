var Conversation = function(speciesList) {
	this.lastAnswer = null;
	this.lastAction = Date.now();
	this.firstmessage = true;
	this.inFindingProcess = false;

	this.speciesCommonNames = speciesList.map((obj)=>obj.triname);
	this.speciesSientificNames = speciesList.map((obj)=>obj.sciname);

	this.location = null;
	this.speciesName = null;

	this.isActive = function(){
			let diff = this.lastAction - Date.now();
			let fiveMinInMs = 1000 * 60 * 5;
			return diff <= fiveMinInMs;

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

		if(match(splitedMessage, ["Hilfe", "Fund Melden"])) {
			var answerOptions = [];

			var helpText = 'ℹ️ Alles klar du, dann lass uns loslegen und deinen Fund zusammen aufnehmen! Was für eine Spezies hast du denn gesehen?';

      this.inFindingProcess = true;

			return { answer: helpText, answerOptions: answerOptions };
		}

		if(this.inFindingProcess){

    	if(match(splitedMessage,this.speciesCommonNames) || match(splitedMessage,this.speciesSientificNames)){

        return {
        	answer: "Sehr schön, hab ich verstanden du hast " + splitedMessage + " bei dir gesehen. " +
					"\n Es wäre super wenn du mir noch deinen Standort zeigen könntest?",
					locationRequest: true
        };

			}

    	else if(this.speciesName == null){

        console.log("Choose species text ", this.speciesCommonNames)
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

var Conversation = function() {
	this.lastAnswer = null;
	this.lastAction = Date.now();
	this.firstmessage = true;

	this.package = null;
	this.pushUpdatesToUser = false;

	this.isActive = function(){
			let diff = this.lastAction - Date.now();
			let fiveMinInMs = 1000 * 60 * 5;
			if(diff > fiveMinInMs ){
				return false
			}
			return true
	};
	this.processMessage = function(message) {
		console.log("Input> " + message);
    this.lastAction = Date.now();
		var splitedMessage = message.split(/[ ,]+/);

		if(this.firstmessage || match(splitedMessage,["hey", "moin", "hallo", "hi", "servus"])) {
			this.firstmessage = false;
			var startText = 'Hallo, ich bin DHAL, ein interaktiver Paketverfolgungsdienst 📦 ' +
			'Schicke mir einfach eine Sendungsnummer oder ein Bild des QR Codes auf deinem ' +
			'Sendungsschein, damit ich Dir sagen kann wie der Status Deines Pakets ist. ' +
			'Schreibe einfach HILFE, wenn Du wissen möchtest wie ich dir helfen kann.';

			var answerOptions = ["Hilfe", "Sendungsverfolgung"];

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

		if(match(splitedMessage, ["Hilfe", "help"])) {
			var answerOptions = [];

			var helpText = 'ℹ️ Du kannst mich zum Beispiel fragen, WO dein Paket gerade ist, ' +
				'WANN es ankommt, WER es Dir gesendet hat oder WOHER es kommt.'

			if(this.package) {
				helpText += '\n\nIch verfolge für Dich gerade das Paket ' + package.trackingNumber + ': ' + package.status + ' 📦';
			} else {
				helpText += '\n\nIm Moment tracke ich keine Pakete für Dich. 😭';
			}

			helpText += 'Um ein Paket hinzuzufügen, sende mir einfach die Sendungsnummer oder ein Bild des QR-Codes auf Deinem Sendungsschein. 😎';

			return { answer: helpText, answerOptions: answerOptions };
		}

		if(message.match(/([\w]+-[\w]+-[\w]+)/g) != null || message.picture) {
			var trackingNumber = message.match(/([\w]+-[\w]+-[\w]+)/g)[0];

			this.package  = { status: "Dein Paket befindet sich in der Zustellung. 😊", 
							trackingNumber: trackingNumber,
							stand:  "(Stand: 05.05.2017 - 09:35 Uhr)",
							location: "Bremen"};


			var packageFoundText = 'Das Paket ' + this.package.trackingNumber + ' habe ich gefunden. 👌 Status: ' + this.package.status + ' '+ this.package.stand
				'\n\nSoll ich Dich bezüglich dieses Pakets auf dem Laufenden halten? 💡';
			var answerOptions = ["Packetstandort", "Zustellungstermin"];

			var answer = { answer: packageFoundText, answerOptions: answerOptions };
			this.lastAnswer = answer;
			return answer;
		}

		const askForPackage  = ()=> {
        var noPackageText = 'Welches Paket meinst du? 🤔';
        var answerOptions = ["Hilfe"];
        return {answer: noPackageText, answerOptions: answerOptions};

    }
		if(match(splitedMessage, ["wo", "Paketstandort", "Standort", "Sendungsverfolgung", "Status","Paketstatus"])) {
			if(!this.package) {
				return askForPackage()
			}

			var answerOptions = [];
			var woText = 'Dein Paket befindet sich dort: ' + this.package.location + ' ' + this.package.stand + '. Status: Dein Paket befindet sich in der Zustellung. ✌️ Kann ich Dir sonst noch irgendwie weiterhelfen? 😛';
			return { answer: woText, answerOptions: answerOptions };
		}

		if(match(splitedMessage, ["wann", "Zustellungstermin"])) {
      if(!this.package) {
        return askForPackage()
      }

			var wannText = 'Dein Paket wird Dir voraussichtlich am Montag (05.05.2017) zwischen 11:00 Uhr und 14:00 Uhr zugestellt. 😍 Soll ich dir bescheid geben, wenn es dazu ein Update gibt? 🤓';
			var answerOptions = ["Ja", "Nein"];
			return { answer: wannText, answerOptions: answerOptions };
		}


		if(match(splitedMessage, ["wer"])) {
      if(!this.package) {
        return askForPackage()
      }

			var werText = 'Amazon hat Dein Paket abgeschickt. 😱 Kann ich dir sonst noch irgendwie weiterhelfen? 😙';
			var answerOptions = [];
			return { answer: werText, answerOptions: answerOptions };
		}

		if(match(splitedMessage, ["woher"])) {
      if(!this.package) {
        return askForPackage()
      }

			var woherText = 'Dein Paket kommt aus China 🇨🇳 und wurde vom Zoll bearbeitet. 👮';
			var answerOptions = [];
			return { answer: woherText, answerOptions: answerOptions };		
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

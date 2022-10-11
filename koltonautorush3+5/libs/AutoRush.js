/**
*  @filename    Rushee.js
*  @author      kolton, Aim2Kill
*  @desc        Rushee script that works with Rusher
*/

const AutoRush = {
	Rusher: {
		profile: "Sorc-Rusher",
		charName: "Rusher-MG"
	},

	BarbHelper: {
		profile: "BarbHelper",
		charName: "Brusherhelp-MG"
	},

	PalaHelper: {
		profile: "PalaHelper",
		charName: "PRusherhelp-MG"
	},

	RushConfig: {
		Cain: false, // Do cain quest.
		Radament: false, // Do Radament quest.
		LamEsen: false, // Do Lam Esen quest.
		Izual: false, // Do Izual quest.
		GiveWps: false, // Give all Wps.(a bit buggy)
		//stopAtLevel: 60, // Reach lvl 60 (still no implemented), the idea is to reach lvl 60+ doing chaos for ancient
	},

	// Leechers: { "profile 1": [list of character infos], "profile 2": [list of character infos]... }
	Leechers: {
		"AutoRushee": [
			{account: "Au1", password: "123", realm: "asia", charName: "au-i", charClass: "paladin", ladder: true, expansion: false, hardcore: false}
		],
		"AutoRushee2": [
			{account: "Au2", password: "123", realm: "asia", charName: "au-ii", charClass: "paladin", ladder: true, expansion: false, hardcore: false}
		],
		"AutoRushee3": [
			{account: "Au3", password: "", realm: "asia", charName: "au-iii", charClass: "paladin", ladder: true, expansion: false, hardcore: false}
		],
		"AutoRushee4": [
			{account: "Au4", password: "", realm: "asia", charName: "au-iv", charClass: "paladin", ladder: true, expansion: false, hardcore: false}
		],
		"AutoRushee5": [
			{account: "Au5", password: "", realm: "asia", charName: "au-v", charClass: "paladin", ladder: true, expansion: false, hardcore: false}
		]
	},

	RushInfo: {
		create: function () {
			let obj = {
				doneCharacters: []
			};

			let string = JSON.stringify(obj);

			Misc.fileAction("data/AutoRush/RushInfo.json", 1, string);

			return obj;
		},

		read: function () {
			let obj;

			if (!FileTools.exists("data/AutoRush/RushInfo.json")) {
				this.create();
			}

			let string = Misc.fileAction("data/AutoRush/RushInfo.json", 0);

			try {
				obj = JSON.parse(string);
			} catch (readError) {
				this.create();
			}

			if (obj) {
				return obj;
			}

			return {
				doneCharacters: []
			};
		},

		update: function (stat, value) {
			let obj;

			obj = this.read();
			obj[stat] = value;
			let string = JSON.stringify(obj);

			Misc.fileAction("data/AutoRush/RushInfo.json", 1, string);
		}
	},

	// Get the next available character's info index from Leechers[profile] array
	getInfo: function (profile) {
		if (!profile) {
			profile = me.profile;
		}

		let rushInfo = this.RushInfo.read();

		for (let i in this.Leechers) {
			if (this.Leechers.hasOwnProperty(i) && this.Leechers[i] instanceof Array && i === profile) {
				for (let j = 0; j < this.Leechers[i].length; j += 1) {
					if (rushInfo.doneCharacters.indexOf(this.Leechers[i][j].charName) === -1) {
						return this.Leechers[i][j];
					}
				}
			}
		}

		return false;
	},

	getQuester: function () {
		let rushInfo = this.RushInfo.read();

		for (let i in this.Leechers) {
			if (this.Leechers.hasOwnProperty(i) && this.Leechers[i] instanceof Array) {
				for (let j = 0; j < this.Leechers[i].length; j += 1) {
					if (rushInfo.doneCharacters.indexOf(this.Leechers[i][j].charName) === -1) {
						return i;
					}
				}
			}
		}

		return false;
	},

	getRushees: function () {
		let rushees = [];
		let rushInfo = this.RushInfo.read();

		for (let i in this.Leechers) {
			if (this.Leechers.hasOwnProperty(i) && this.Leechers[i] instanceof Array) {
				for (let j = 0; j < this.Leechers[i].length; j += 1) {
					if (rushInfo.doneCharacters.indexOf(this.Leechers[i][j].charName) === -1) {
						rushees.push(this.Leechers[i][j].charName);

						break;
					}
				}
			}
		}

		return rushees;
	},

	finishRush: function () {
		let rushInfo = this.RushInfo.read();
		let charArray = rushInfo.doneCharacters;

		if (charArray.indexOf(me.charname) === -1) {
			charArray.push(me.charname);
			this.RushInfo.update("doneCharacters", charArray);
		}

		return true;
	}
};
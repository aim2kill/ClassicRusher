/**
*  @filename    RusherHelper.js
*  @author      kolton, theBGuy, Aim2Kill
*  @desc        RusherHelper script that works with AutoRusher(Classic only)
*
*/

function AutoRushHelper() {
	include("autorush.js");

	let leaderRoster, pos, actions = [];
	let leader = AutoRush.Rusher.charName;
	let barbhelper = AutoRush.BarbHelper.charName;
	let palahelper = AutoRush.PalaHelper.charName;

	this.log = function (msg = "", sayMsg = false) {
		print(msg);
		sayMsg && say(msg);
	};

	this.findPlayer = function (name) {
		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && party.name === name) {
					return party;
				}
			} while (party.getNext());
		}

		return false;
	};

	this.playersInAct = function (act) {
		!act && (act = me.act);

		let area = sdk.areas.townOfAct(act);
		let party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && party.name !== leader && party.name !== barbhelper && party.name !== palahelper && party.area !== area) {
					return false;
				}
			} while (party.getNext());
		}

		return true;
	};

	this.playerIn = function (area) {
		!area && (area = me.area);

		let party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && party.name !== leader && party.name !== barbhelper && party.name !== palahelper && party.area === area) {
					return true;
				}
			} while (party.getNext());
		}

		return false;
	};

	this.getPartyAct = function () {
		let party = getParty();
		let minArea = 999;

		do {
			if (party.name !== me.name && party.name !== leader && party.name !== barbhelper && party.name !== palahelper) {
				while (!party.area) {
					me.overhead("Waiting for party area info");
					delay(100);
				}

				if (party.area < minArea) {
					minArea = party.area;
				}
			}
		} while (party.getNext());

		return sdk.areas.actOf(minArea);
	};

	// START
	//addEventListener("gameevent", AutoRush.quitEvent);
	switch (this.getPartyAct()) {
		case 1:
			Town.goToTown(1);
			Town.move("portalspot");

			break;
		case 2:
			Town.goToTown(2);
			Town.move("portalspot");

			break;
		case 3:
			Town.goToTown(3);
			Town.move("portalspot");

			break;
		case 4:
			Town.goToTown(4);
			Town.move("portalspot");

			break;
	}

	while (!leaderRoster) {
		leaderRoster = this.findPlayer(leader);

		delay(500);
	}

	addEventListener("chatmsg",
		function (who, msg) {
			if (who === leader) {
				switch (msg) {
					case "bye ~":
						quit();

						break;
					case "we're done":
						delay(2000);
						D2Bot.stop();

						break;
					case "clear":
						switch (leaderRoster.area) {
							// act 1 clear areas
							case sdk.areas.DarkWood:
							case sdk.areas.StonyField:
							case sdk.areas.Tristram:
								if (Pather.usePortal(leaderRoster.area, leader)) {

									pos = { x: me.x, y: me.y };

									Attack.clear(me.area === sdk.areas.DarkWood ? sdk.areas.StonyField : 30);
									Pather.moveToUnit(pos);

									while (leaderRoster.area === me.area && !this.playerIn()) {
										Attack.clear(me.area === sdk.areas.DarkWood ? sdk.areas.StonyField : 30);
										Pather.moveToUnit(pos);
										delay(200);
									}

									while (this.playerIn()) {
										Attack.securePosition(me.x, me.y, 30);
										Pather.moveToUnit(pos);
										delay(100);
									}

									if (!Pather.usePortal(null, leader)) {
										Town.goToTown(me.area === sdk.areas.RogueEncampment ? 1 : undefined);
									}
								}

								break;
							// Helping Rusher clear room before killing Andy
							case sdk.areas.CatacombsLvl4:
								if (Pather.usePortal(sdk.areas.CatacombsLvl4, leader)) {
									Attack.securePosition(me.x, me.y, 30);

									if (!Pather.usePortal(null, leader)) {
										Town.goToTown(1);
									}

									Town.move("portalspot");
								}

								break;
							// act 2 clear areas
							case sdk.areas.HallsoftheDeadLvl3:
							case sdk.areas.ClawViperTempleLvl2:
							case sdk.areas.MaggotLairLvl3:
							case sdk.areas.ArcaneSanctuary:
							case sdk.areas.A2SewersLvl3:
								if (Pather.usePortal(leaderRoster.area, leader)) {

									pos = { x: me.x, y: me.y };

									Attack.clear(me.area === sdk.areas.ClawViperTempleLvl2 ? sdk.areas.HallsoftheDeadLvl3 : 25);
									Pather.moveToUnit(pos);
									Precast.doPrecast(true);

									while (leaderRoster.area === me.area && !this.playerIn()) {
										Attack.clear(me.area === sdk.areas.ClawViperTempleLvl2 ? sdk.areas.HallsoftheDeadLvl3 : 25);
										Pather.moveToUnit(pos);
										delay(200);
									}

									switch (me.area) {
										case sdk.areas.A2SewersLvl3:

											while (!this.playerIn()) {
												Attack.securePosition(me.x, me.y, 35);
												delay(200);
											}

											Attack.kill(sdk.monsters.Radament);
									}

									while (leaderRoster.area === me.area) {
										Attack.securePosition(me.x, me.y, 20, 1000);
										delay(200);
									}

									if (!Pather.usePortal(null, leader)) {
										Town.goToTown(me.area === sdk.areas.LutGholein ? 2 : undefined);
									}
								}

								break;
							// Helping Rusher clear room to place staff 
							case sdk.areas.TalRashasTomb1:
							case sdk.areas.TalRashasTomb2:
							case sdk.areas.TalRashasTomb3:
							case sdk.areas.TalRashasTomb4:
							case sdk.areas.TalRashasTomb5:
							case sdk.areas.TalRashasTomb6:
							case sdk.areas.TalRashasTomb7:
								if (Pather.usePortal(leaderRoster.area, leader)) {

									pos = { x: me.x, y: me.y };

									while (leaderRoster.area === me.area && !this.playerIn()) {
										Attack.securePosition(me.x, me.y, 25);
										Pather.moveToUnit(pos);
										delay(200);
									}

									while (this.playerIn()) {
										delay(100);
									}

									if (!Pather.usePortal(null, leader)) {
										Town.goToTown(me.area === sdk.areas.LutGholein ? 2 : undefined);
									}
								}

								break;
							// act 3 clear area
							case sdk.areas.RuinedTemple:
								if (Pather.usePortal(leaderRoster.area, leader)) {

									pos = { x: me.x, y: me.y };

									while (leaderRoster.area === me.area && !this.playerIn()) {
										Attack.clear(me.x, me.y, 35, 1000);
										Pather.moveToUnit(pos);
										delay(200);
									}

									while (this.playerIn()) {
										Attack.securePosition(me.x, me.y, 35);
										Pather.moveToUnit(pos);
										delay(100);
									}

									if (!Pather.usePortal(null, leader)) {
										Town.goToTown(me.area === sdk.areas.KurastDocktown ? 3 : undefined);
									}
								}

								break;
							// Helping Rusher clear a spot for rushee
							case sdk.areas.Travincal:
								if (Pather.usePortal(leaderRoster.area, leader)) {

									while (leaderRoster.area === me.area && !this.playerIn()) {
										Attack.securePosition(me.x, me.y, 25);
										Pather.moveToUnit(pos);
										delay(100);
									}
								}

								break;
							// act 4 clear areas
							case sdk.areas.PlainsofDespair:
								if (Pather.usePortal(leaderRoster.area, leader)) {

									while (!this.playerIn()) {
										Attack.securePosition(me.x, me.y, 35, 3000);
										delay(200);
									}

									Attack.kill(sdk.monsters.Izual);

									if (!Pather.usePortal(null, leader)) {
										Town.goToTown(me.area === sdk.areas.PandemoniumFortress ? 4 : undefined);
									}
								}

								break;

						}

						break;
					case "kill":
						switch (leaderRoster.area) {
							case sdk.areas.CatacombsLvl4: // andariel
								if (Pather.usePortal(sdk.areas.CatacombsLvl4, leader)) {

									Attack.kill(sdk.monsters.Andariel);
									Pickit.pickItems();
									Pather.makePortal() && Pather.usePortal(null, me.name);
								}
								Town.goToTown(4) && Town.doChores();
								Town.goToTown(2) && Town.move("portalspot");

								break;
							case sdk.areas.DurielsLair: // duriel
								if (Pather.usePortal(sdk.areas.DurielsLair, leader)) {

									Attack.kill(sdk.monsters.Duriel);
									Pickit.pickItems();

									if (!Pather.usePortal(null, leader)) {
										Town.goToTown(me.area === sdk.areas.LutGholein ? 2 : undefined);
									}
								}

								Town.goToTown(4) && Town.doChores();
								Town.goToTown(3) && Town.move("portalspot");

								break;
							case sdk.areas.Travincal: // councils
								if (Pather.usePortal(sdk.areas.Travincal, leader)) {

									Attack.clearList(Attack.getMob([sdk.monsters.Council1, sdk.monsters.Council2, sdk.monsters.Council3], 0, 40));
									Pickit.pickItems();
								}

								break;
							case sdk.areas.DuranceofHateLvl3: // mephisto
								if (Pather.usePortal(sdk.areas.DuranceofHateLvl3, leader)) {

									Attack.kill(sdk.monsters.Mephisto);
									Pickit.pickItems();
									Pather.moveTo(17591, 8070);

									while (!this.playersInAct(4)) {
										delay(250);
									}

									Pather.usePortal(null);
								}

								break;
							case sdk.areas.ChaosSanctuary: // diablo
								if (Pather.usePortal(sdk.areas.ChaosSanctuary, leader)) {

									Pather.moveTo(17591, 8070);
									Common.Diablo.diabloPrep();
									Attack.kill(sdk.monsters.Diablo);
									Pickit.pickItems();

									while (!this.playerIn(sdk.areas.ChaosSanctuary)) {
										delay(250);
									}

									Pather.usePortal(null);
								}
								break;
						}

						break;
					case "seal1":
						switch (leaderRoster.area) {
							case sdk.areas.ChaosSanctuary: // GrandVizierofChaos
								if (Pather.usePortal(sdk.areas.ChaosSanctuary, leader)) {
									while (!Common.Diablo.getBoss(getLocaleString(sdk.locale.monsters.GrandVizierofChaos))) {
										Attack.securePosition(me.x, me.y, 35, 3000);
										delay(100);
									}
									Attack.kill(getLocaleString(sdk.locale.monsters.GrandVizierofChaos));
								}
								break;
						}

						break;
					case "seal2":
						switch (leaderRoster.area) {
							case sdk.areas.ChaosSanctuary: // LordDeSeis
								if (Pather.usePortal(sdk.areas.ChaosSanctuary, leader)) {
									while (!Common.Diablo.getBoss(getLocaleString(sdk.locale.monsters.LordDeSeis))) {
										Attack.securePosition(me.x, me.y, 25, 2000);
										delay(100);
									}
									Attack.kill(getLocaleString(sdk.locale.monsters.LordDeSeis));
								}
								break;
						}

						break;
					case "seal3":
						switch (leaderRoster.area) {
							case sdk.areas.ChaosSanctuary: // InfectorofSouls
								if (Pather.usePortal(sdk.areas.ChaosSanctuary, leader)) {
									while (!Common.Diablo.getBoss(getLocaleString(sdk.locale.monsters.InfectorofSouls))) {
										Attack.securePosition(me.x, me.y, 35, 3000);
										delay(100);
									}
									Attack.kill(getLocaleString(sdk.locale.monsters.InfectorofSouls));
								}
								break;
						}

						break;
					case "out":
						switch (me.area) {
							case sdk.areas.Travincal:
							case sdk.areas.KurastDocktown:
							case sdk.areas.ChaosSanctuary:
							case sdk.areas.PandemoniumFortress:
								if (!me.inTown) {
									Town.goToTown();
								}
								Town.move("portalspot");
								break;
						}

						break;
					default:
						if (who === leader) {
							actions.push(msg);
						}

						break;



				}
			}
		});

	MainLoop:
	while (true) {
		switch (leaderRoster.area) {
			case sdk.areas.DarkWood:
			case sdk.areas.StonyField:
			case sdk.areas.Tristram:
			case sdk.areas.CatacombsLvl4:
				if (me.area !== sdk.areas.RogueEncampment) {
					Town.goToTown(1);
					Town.move("portalspot");
				}

				break;
			case sdk.areas.HallsoftheDeadLvl3:
			case sdk.areas.ClawViperTempleLvl2:
			case sdk.areas.MaggotLairLvl3:
			case sdk.areas.ArcaneSanctuary:
			case sdk.areas.TalRashasTomb1:
			case sdk.areas.TalRashasTomb2:
			case sdk.areas.TalRashasTomb3:
			case sdk.areas.TalRashasTomb4:
			case sdk.areas.TalRashasTomb5:
			case sdk.areas.TalRashasTomb6:
			case sdk.areas.TalRashasTomb7:
			case sdk.areas.A2SewersLvl3:
				if (me.area !== sdk.areas.LutGholein) {
					Town.goToTown(2);
					Town.move("portalspot");
				}

				break;
			case sdk.areas.RuinedTemple:
			case sdk.areas.Travincal:
			case sdk.areas.DuranceofHateLvl3:
				if (me.area !== sdk.areas.KurastDocktown) {
					Town.goToTown(3);
					Town.move("portalspot");
				}

				break;
			case sdk.areas.PlainsofDespair:
			case sdk.areas.ChaosSanctuary:
				if (me.area !== sdk.areas.PandemoniumFortress) {
					Town.goToTown(4);
					Town.move("portalspot");
				}

				break;
			case sdk.areas.Harrogath:
			case sdk.areas.FrozenRiver:
			case sdk.areas.WorldstoneChamber:
			case sdk.areas.ThroneofDestruction:
				if (me.area !== sdk.areas.Harrogath) {
					Town.goToTown(5);
					Town.move("portalspot");
				}

				break MainLoop;
		}
	}

	delay(500);
	return true;
}
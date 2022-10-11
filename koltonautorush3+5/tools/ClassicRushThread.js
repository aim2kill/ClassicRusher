/**
*  @filename    ClassicRushThread.js
*  @author      kolton, theBGuy, Aim2Kill
*  @desc        Second half of the Rusher script
*
*/
js_strict(true);

include("json2.js");
include("NTItemParser.dbl");
include("OOG.js");
include("Gambling.js");
include("AutoMule.js");
include("CraftingSystem.js");
include("TorchSystem.js");
include("common/util.js");
includeCommonLibs();
include("AutoRush.js");

let Overrides = require("../modules/Override");

let count = 0;
let silentNameTracker = [];
let wpsToGive = Pather.nonTownWpAreas.slice(0).filter(function (area) {
	if (area === sdk.areas.HallsofPain) return false;
	if (me.classic && area >= sdk.areas.Harrogath) return false;
	return true;
});

function wpEvent(who, msg) {
	if (typeof msg === "string" && msg === "gotwp" || msg === "Failed to get wp") {
		count++;
		!silentNameTracker.includes(who) && silentNameTracker.push(who);
	}
}

function giveWP() {
	let wp = Game.getObject("waypoint");
	let success = false;
	let barbhelper = AutoRush.BarbHelper.charName;
	let palahelper = AutoRush.PalaHelper.charName;

	if (wp && !me.inTown && wpsToGive.includes(me.area)) {
		try {
			addEventListener("chatmsg", wpEvent);
			let playerCount = Misc.getPartyCount();
			let mobCount = getUnits(sdk.unittype.Monster).filter(mon => mon.distance <= 15 && mon.attackable).length;
			mobCount > 0 && Attack.securePosition(me.x, me.y, 15, Time.seconds(30), true);
			wp.distance > 5 && Pather.moveToUnit(wp);
			Pather.makePortal();
			say("wp");
			let tick = getTickCount();
			while (getTickCount() - tick < Time.minutes(2)) {
				let player = Game.getPlayer();
				if (player) {
					do {
						if (player.name !== me.name && party.name !== barbhelper && party.name !== palahelper && !silentNameTracker.includes(player.name)) {
							silentNameTracker.push(player.name);
						}
					} while (player.getNext());
				}
				if (count === playerCount || (silentNameTracker.length === playerCount && Misc.getNearbyPlayerCount() === 0)) {
					wpsToGive.remove(me.area);
					success = true;
					break;
				}
				delay(50);
			}
		} catch (e) {
			console.error(e);
			Config.LocalChat.Enabled && say("Failed to give wp");
		} finally {
			removeEventListener("chatmsg", wpEvent);
			silentNameTracker = [];
			count = 0;
		}
		return success;
	}

	return false;
}

new Overrides.Override(Pather, Pather.useWaypoint, function (orignal, targetArea, check) {
	if (orignal(targetArea, check)) {
		return (AutoRush.RushConfig.GiveWps && giveWP()) || true;
	} else {
		print("failed");

		return false;
	}
}).apply();

function main() {
	let tick;
	let barbhelper = AutoRush.BarbHelper.charName;
	let palahelper = AutoRush.PalaHelper.charName;

	this.log = function (msg = "", sayMsg = true) {
		console.log(msg);
		sayMsg && say(msg);
	};

	this.playerIn = function (area) {
		!area && (area = me.area);

		let party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && party.name !== barbhelper && party.name !== palahelper && party.area === area) {
					return true;
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
				if (party.name !== me.name && party.name !== barbhelper && party.name !== palahelper && party.area !== area) {
					return false;
				}
			} while (party.getNext());
		}

		return true;
	};

	this.andariel = function () {
		this.log("starting andariel");
		Town.doChores();
		Pather.useWaypoint(sdk.areas.CatacombsLvl2, true) && Precast.doPrecast(true);

		if (!Pather.moveToExit([sdk.areas.CatacombsLvl3, sdk.areas.CatacombsLvl4], true)
			|| !Pather.moveTo(22606, 9612)) {
			throw new Error("andy failed");
		}

		Pather.makePortal();
		this.log("clear");
		Attack.securePosition(me.x, me.y, 40, 3000, true);

		while (Game.getPlayer(barbhelper)) {
			delay(200);
		}

		this.log("1");

		while (!this.playerIn()) {
			Pather.moveTo(22606, 9612);
			delay(250);
		}

		Pather.moveTo(22547, 9553) && Pather.makePortal();
		this.log("kill");
		Attack.kill(sdk.monsters.Andariel);
		Pather.moveTo(22606, 9612) && Pather.makePortal();
		delay(300);
		this.log("2");

		while (this.playerIn()) {
			delay(250);
		}

		Pather.usePortal(null, me.name);
		this.log("a2");
		Town.goToTown(2);

		while (!this.playersInAct(2)) {
			delay(250);
		}

		return true;
	};

	this.cube = function () {
		if (me.normal) {
			this.log("starting cube");
			Pather.useWaypoint(sdk.areas.HallsoftheDeadLvl2, true);
			Precast.doPrecast(true);

			if (!Pather.moveToExit(sdk.areas.HallsoftheDeadLvl3, true)
				|| !Pather.moveToPreset(me.area, sdk.unittype.Object, sdk.quest.chest.HoradricCubeChest)) {
				throw new Error("cube failed");
			}

			Pather.makePortal() && this.log("clear");
			Attack.securePosition(me.x, me.y, 30, 3000, true);
			this.log("1");

			while (!this.playerIn()) {
				delay(100);
			}

			while (this.playerIn()) {
				delay(100);
			}

			Pather.usePortal(null, me.name);
		}

		return true;
	};

	this.amulet = function () {
		this.log("starting amulet");
		Town.doChores();
		Pather.useWaypoint(sdk.areas.LostCity, true) && Precast.doPrecast(true);

		if (!Pather.moveToExit([sdk.areas.ValleyofSnakes, sdk.areas.ClawViperTempleLvl1, sdk.areas.ClawViperTempleLvl2], true)
			|| !Pather.moveTo(15042, 14067)) {
			throw new Error("amulet failed");
		}

		Pather.makePortal() && this.log("clear");
		Attack.securePosition(me.x, me.y, 25, 3000, me.hell, me.hell);
		Pather.moveTo(15044, 14045) && Pather.makePortal();
		this.log("1");

		while (!this.playerIn()) {
			delay(100);
		}

		while (this.playerIn()) {
			delay(100);
		}

		Pather.usePortal(null, me.name);

		return true;
	};

	this.staff = function () {
		this.log("starting staff");
		Town.doChores();
		Pather.useWaypoint(sdk.areas.FarOasis, true) && Precast.doPrecast(true);

		if (!Pather.moveToExit([sdk.areas.MaggotLairLvl1, sdk.areas.MaggotLairLvl2, sdk.areas.MaggotLairLvl3], true)
			|| !Pather.moveToPreset(me.area, sdk.unittype.Object, sdk.quest.chest.ShaftoftheHoradricStaffChest)) {
			throw new Error("staff failed");
		}

		Pather.makePortal() && this.log("clear");
		Attack.securePosition(me.x, me.y, 30, 3000, true);
		this.log("1");

		while (!this.playerIn()) {
			delay(100);
		}

		while (this.playerIn()) {
			delay(100);
		}

		Pather.usePortal(null, me.name);

		return true;
	};

	this.summoner = function () {
		// right up 25449 5081 (25431, 5011)
		// left up 25081 5446 (25011, 5446)
		// right down 25830 5447 (25866, 5431)
		// left down 25447 5822 (25431, 5861)

		this.log("starting summoner");
		Town.doChores();
		Pather.useWaypoint(sdk.areas.ArcaneSanctuary, true) && Precast.doPrecast(true);

		let preset = Game.getPresetObject(sdk.areas.ArcaneSanctuary, sdk.quest.chest.Journal);
		let spot = {};

		switch (preset.roomx * 5 + preset.x) {
			case 25011:
				spot = { x: 25081, y: 5446 };
				break;
			case 25866:
				spot = { x: 25830, y: 5447 };
				break;
			case 25431:
				switch (preset.roomy * 5 + preset.y) {
					case 5011:
						spot = { x: 25449, y: 5081 };
						break;
					case 5861:
						spot = { x: 25447, y: 5822 };
						break;
				}

				break;
		}

		if (!Pather.moveToUnit(spot)) {
			throw new Error("summoner failed");
		}

		Pather.makePortal() && this.log("clear");
		Attack.securePosition(me.x, me.y, 25, 3000);
		this.log("1");

		while (!this.playerIn()) {
			Pather.moveToUnit(spot);
			Attack.securePosition(me.x, me.y, 25, 500);
			delay(250);
		}

		Pather.moveToPreset(me.area, sdk.unittype.Object, sdk.quest.chest.Journal);
		Attack.kill(sdk.monsters.Summoner);
		this.log("2");

		while (this.playerIn()) {
			delay(100);
		}

		Pickit.pickItems();
		Pather.moveToPreset(me.area, sdk.unittype.Object, sdk.quest.chest.Journal);

		let redPortal = Game.getObject(sdk.objects.RedPortal);

		if (!redPortal || !this.usePortal(null, null, redPortal)) {
			if (!Misc.poll(() => {
				let journal = Game.getObject(sdk.quest.chest.Journal);

				if (journal && journal.interact()) {
					delay(1000);
					me.cancel();
				}

				redPortal = Pather.getPortal(sdk.areas.CanyonofMagic);

				return (redPortal && Pather.usePortal(null, null, redPortal));
			})) throw new Error("summoner failed");
		}

		return true;
	};

	this.duriel = function () {
		this.log("starting duriel");

		if (me.inTown) {
			Town.doChores();
			Pather.useWaypoint(sdk.areas.CanyonofMagic, true);
		} else {
			giveWP();
		}

		Precast.doPrecast(true);

		if (!Pather.moveToExit(getRoom().correcttomb, true)
			|| !Pather.moveToPreset(me.area, sdk.unittype.Object, sdk.quest.chest.HoradricStaffHolder)) {
			throw new Error("duriel failed");
		}

		Pather.makePortal() && this.log("clear");
		Attack.securePosition(me.x, me.y, 30, 3000, true, me.hell);
		this.log("1");

		while (!this.playerIn()) {
			delay(100);
		}

		while (this.playerIn()) {
			delay(100);
		}

		while (!Game.getObject(sdk.objects.PortaltoDurielsLair)) {
			delay(500);
		}

		Pather.useUnit(sdk.unittype.Object, sdk.objects.PortaltoDurielsLair, sdk.areas.DurielsLair);
		Pather.moveTo(22641, 15725) && Pather.makePortal() && this.log("kill");
		Attack.kill(sdk.monsters.Duriel);
		Pickit.pickItems();

		Pather.teleport = false;

		Pather.moveTo(22579, 15706);

		Pather.teleport = true;

		Pather.moveTo(22577, 15649, 10);
		Pather.moveTo(22577, 15609, 10);
		Pather.makePortal();
		this.log("1");

		while (!this.playerIn()) {
			delay(100);
		}

		if (!Pather.usePortal(null, me.name)) {
			Town.goToTown();
		}

		Pather.useWaypoint(sdk.areas.PalaceCellarLvl1);
		Pather.moveToExit([sdk.areas.HaremLvl2, sdk.areas.HaremLvl1], true);
		Pather.moveTo(10022, 5047);
		this.log("a3");
		Town.goToTown(3);
		Town.doChores();

		while (!this.playersInAct(3)) {
			delay(250);
		}

		return true;
	};

	// re-write to prevent fail to complete quest due to killing council from to far away
	this.travincal = function () {
		this.log("starting travincal");
		Town.doChores();
		Pather.useWaypoint(sdk.areas.Travincal, true) && Precast.doPrecast(true);

		let coords = [me.x, me.y];

		Pather.moveTo(coords[0] + 50, coords[1] - 137);
		Pather.makePortal();
		me.diff == 2 && this.log("clear");
		Attack.securePosition(me.x, me.y, 35, 3000);
		this.log("1");

		while (!this.playerIn()) {
			delay(250);
		}
		if (me.diff == 2) {
			this.log("out");
			delay(3000);
		}

		Pather.moveTo(coords[0] + 86, coords[1] - 130);
		Pather.moveTo(coords[0] + 71, coords[1] - 94);
		Pather.makePortal() && this.log("kill");
		Attack.clearList(Attack.getMob([sdk.monsters.Council1, sdk.monsters.Council2, sdk.monsters.Council3], 0, 40));
		Pickit.pickItems();

		Pather.moveTo(coords[0] + 50, coords[1] - 137);
		Pather.makePortal();
		this.log("2");
		Pather.usePortal(null, me.name);

		return true;
	};

	this.mephisto = function () {
		this.log("starting mephisto");

		Town.doChores();
		Pather.useWaypoint(sdk.areas.DuranceofHateLvl2, true) && Precast.doPrecast(true);
		Pather.moveToExit(sdk.areas.DuranceofHateLvl3, true) && Pather.moveTo(17692, 8023) && Pather.makePortal();
		delay(2000);
		this.log("1");

		while (!this.playerIn()) {
			delay(250);
		}

		Pather.moveTo(17591, 8070);
		Pather.makePortal() && this.log("kill");
		Attack.kill(sdk.monsters.Mephisto);
		Pickit.pickItems();
		Pather.moveTo(17692, 8023) && Pather.makePortal();
		this.log("2");

		while (this.playerIn()) {
			delay(250);
		}

		Pather.moveTo(17591, 8070) && Attack.securePosition(me.x, me.y, 40, 3000);

		let hydra = Game.getMonster(getLocaleString(sdk.locale.monsters.Hydra));

		if (hydra) {
			do {
				while (!hydra.dead && hydra.hp > 0) {
					delay(500);
				}
			} while (hydra.getNext());
		}

		Pather.makePortal();
		Pather.moveTo(17581, 8070);
		this.log("1");

		while (!this.playerIn()) {
			delay(250);
		}

		this.log("a4");

		while (!this.playersInAct(4)) {
			delay(250);
		}

		delay(2000);
		Pather.usePortal(null);

		return true;
	};

	this.diablo = function () {
		this.log("starting diablo");

		function inviteIn() {
			Pather.moveTo(7763, 5267) && Pather.makePortal();
			Pather.moveTo(7773, 5286);
			this.log("1");
			this.log("kill");

			while (!this.playerIn()) {
				delay(250);
			}

			return true;
		}

		Town.doChores();
		Pather.useWaypoint(sdk.areas.RiverofFlame);
		Precast.doPrecast(true);
		if (!Pather.moveToExit(sdk.areas.ChaosSanctuary, true) && !Pather.moveTo(7790, 5544)) throw new Error("Failed to move to Chaos Sanctuary");
		Common.Diablo.initLayout();

		Common.Diablo.vizLayout === 1 ? Pather.moveTo(7669, 5288) : Pather.moveTo(7654, 5292);
		Pather.makePortal() && say("seal1");
		Attack.securePosition(me.x, me.y, 35, 3000, true);
		Common.Diablo.openSeal(sdk.objects.DiabloSealVizier2) && Common.Diablo.openSeal(sdk.objects.DiabloSealVizier);

		while (!Common.Diablo.getBoss(getLocaleString(sdk.locale.monsters.GrandVizierofChaos))) {
			delay(100);
		}

		say("out");

		Common.Diablo.seisLayout === 1 ? Pather.moveTo(7773, 5206) : Pather.moveTo(7767, 5169);
		Pather.makePortal() && say("seal2");
		Attack.securePosition(me.x, me.y, 35, 3000, true);
		Common.Diablo.openSeal(sdk.objects.DiabloSealSeis);

		while (!Common.Diablo.getBoss(getLocaleString(sdk.locale.monsters.LordDeSeis))) {
			delay(100);
		}

		say("out");

		Common.Diablo.infLayout === 1 ? Pather.moveTo(7903, 5294) : Pather.moveTo(7920, 5290);
		Pather.makePortal() && say("seal3");
		Attack.securePosition(me.x, me.y, 35, 3000, true);
		Common.Diablo.openSeal(sdk.objects.DiabloSealInfector2) && Common.Diablo.openSeal(sdk.objects.DiabloSealInfector);

		while (!Common.Diablo.getBoss(getLocaleString(sdk.locale.monsters.InfectorofSouls))) {
			delay(100);
		}

		say("out");

		inviteIn() && Common.Diablo.diabloPrep();
		Attack.kill(sdk.monsters.Diablo);
		this.log("2");
		Pickit.pickItems();

		return true;
	};

	this.clearArea = function (area) {
		Pather.journeyTo(area);
		Attack.clearLevel(0);
		this.log("Done clearing area: " + area);
	};

	// Extra Quests
	this.cain = function () {
		if (!AutoRush.RushConfig.Cain) return false;
		this.log("starting cain");

		Town.doChores();
		Pather.useWaypoint(sdk.areas.DarkWood, true) && Precast.doPrecast(true);

		if (!Pather.moveToPreset(sdk.areas.DarkWood, sdk.unittype.Object, sdk.quest.chest.InifussTree, 5, 5)) {
			throw new Error("Failed to move to Tree of Inifuss");
		}

		let tree = Game.getObject(sdk.quest.chest.InifussTree);
		!!tree && tree.distance > 5 && Pather.moveToUnit(tree);
		Pather.makePortal() && this.log("clear");
		Attack.securePosition(me.x, me.y, 40, 3000, true);
		!!tree && tree.distance > 5 && Pather.moveToUnit(tree);
		this.log("1");
		tick = getTickCount();

		while (getTickCount() - tick < Time.minutes(2)) {
			if (tree.mode) {
				break;
			}
			Attack.securePosition(me.x, me.y, 20, 1000);
		}

		Pather.usePortal(1) || Town.goToTown();
		Pather.useWaypoint(sdk.areas.StonyField, true);
		Precast.doPrecast(true);
		Pather.moveToPreset(sdk.areas.StonyField, sdk.unittype.Monster, sdk.monsters.preset.Rakanishu, 5, 5, false, true);
		Pather.moveToPreset(sdk.areas.StonyField, sdk.unittype.Object, sdk.quest.chest.StoneAlpha, null, null, true);
		Pather.makePortal() && this.log("clear");
		Attack.securePosition(me.x, me.y, 40, 3000, true);
		this.log("1");

		tick = getTickCount();

		while (getTickCount() - tick < Time.minutes(2)) {
			if (Pather.usePortal(sdk.areas.Tristram)) {
				break;
			}
			Attack.securePosition(me.x, me.y, 35, 1000);
		}

		if (me.area === sdk.areas.Tristram) {
			delay(3000);
			Pather.moveTo(me.x, me.y + 6);
			let gibbet = Game.getObject(sdk.quest.chest.CainsJail);

			if (gibbet && !gibbet.mode) {
				if (!Pather.moveToPreset(me.area, sdk.unittype.Object, sdk.quest.chest.CainsJail, 2, 2, true, true)) {
					throw new Error("Failed to move to Cain's Jail");
				}

				Pather.moveTo(25134, 5136) && Pather.makePortal() && this.log("clear");
				Attack.securePosition(gibbet.x, gibbet.y, 40, 3000);
				this.log("1");

				tick = getTickCount();

				while (getTickCount() - tick < Time.minutes(2)) {
					if (gibbet.mode) {
						break;
					}
					Attack.securePosition(me.x, me.y, 20, 1000);
				}
			}
		}

		return true;
	};

	this.radament = function () {
		if (!AutoRush.RushConfig.Radament) return false;
		this.log("starting radament");

		let moveIntoPos = function (unit, range) {
			let coords = [];
			let angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI);
			let angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 105, -105, 120, -120, 135, -135, 150, -150, 180];

			for (let i = 0; i < angles.length; i += 1) {
				let coordx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * range + unit.x);
				let coordy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * range + unit.y);

				try {
					if (!(getCollision(unit.area, coordx, coordy) & 0x1)) {
						coords.push({
							x: coordx,
							y: coordy
						});
					}
				} catch (e) {
					continue;
				}
			}

			if (coords.length > 0) {
				coords.sort(Sort.units);

				return Pather.moveToUnit(coords[0]);
			}

			return false;
		};

		Pather.useWaypoint(sdk.areas.A2SewersLvl2, true) && Precast.doPrecast(false);
		Pather.moveToExit(sdk.areas.A2SewersLvl3, true);

		let radaPreset = Game.getPresetObject(sdk.areas.A2SewersLvl3, sdk.quest.chest.HoradricScrollChest);
		let radaCoords = {
			area: sdk.areas.A2SewersLvl3,
			x: radaPreset.roomx * 5 + radaPreset.x,
			y: radaPreset.roomy * 5 + radaPreset.y
		};

		moveIntoPos(radaCoords, 50);
		let rada = Misc.poll(() => Game.getMonster(sdk.monsters.Radament), 1500, 500);

		rada ? moveIntoPos(rada, 60) : print("radament unit not found");
		Pather.makePortal() && this.log("clear");
		Attack.securePosition(me.x, me.y, 35, 3000);
		this.log("1");

		while (!this.playerIn()) {
			delay(200);
		}

		Attack.kill(sdk.monsters.Radament);

		let returnSpot = {
			x: me.x,
			y: me.y
		};

		this.log("2");
		Pickit.pickItems();
		Attack.securePosition(me.x, me.y, 30, 3000);

		while (this.playerIn()) {
			delay(200);
		}

		Pather.moveToUnit(returnSpot);
		Pather.makePortal();
		this.log("all in");

		while (!this.playerIn()) {
			delay(200);
		}

		Misc.poll(() => !Game.getItem(sdk.quest.item.BookofSkill), 30000, 1000);

		while (this.playerIn()) {
			delay(200);
		}

		Pather.usePortal(null, null);

		return true;
	};

	this.lamesen = function () {
		if (!AutoRush.RushConfig.LamEsen) return false;
		this.log("starting lamesen");

		if (!Town.goToTown() || !Pather.useWaypoint(sdk.areas.KurastBazaar, true)) {
			throw new Error("Lam Essen quest failed");
		}

		Precast.doPrecast(false);

		if (!Pather.moveToExit(sdk.areas.RuinedTemple, true)
			|| !Pather.moveToPreset(me.area, sdk.unittype.Object, sdk.quest.chest.LamEsensTomeHolder)) {
			throw new Error("Lam Essen quest failed");
		}

		Pather.makePortal() && this.log("clear");
		Attack.securePosition(me.x, me.y, 30, 2000);
		this.log("1");

		while (!this.playerIn()) {
			delay(200);
		}

		while (this.playerIn()) {
			delay(200);
		}

		Pather.usePortal(null, null);

		return true;
	};

	this.izual = function () {
		if (!AutoRush.RushConfig.Izual) return false;
		this.log("starting izual");

		let moveIntoPos = function (unit, range) {
			let coords = [];
			let angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI);
			let angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 105, -105, 120, -120, 135, -135, 150, -150, 180];

			for (let i = 0; i < angles.length; i += 1) {
				let coordx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * range + unit.x);
				let coordy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * range + unit.y);

				try {
					if (!(getCollision(unit.area, coordx, coordy) & 0x1)) {
						coords.push({
							x: coordx,
							y: coordy
						});
					}
				} catch (e) {
					continue;
				}
			}

			if (coords.length > 0) {
				coords.sort(Sort.units);

				return Pather.moveToUnit(coords[0]);
			}

			return false;
		};

		Pather.useWaypoint(sdk.areas.CityoftheDamned, true) && Precast.doPrecast(false);
		Pather.moveToExit(sdk.areas.PlainsofDespair, true);

		let izualPreset = Game.getPresetMonster(sdk.areas.PlainsofDespair, sdk.monsters.Izual);
		let izualCoords = {
			area: sdk.areas.PlainsofDespair,
			x: izualPreset.roomx * 5 + izualPreset.x,
			y: izualPreset.roomy * 5 + izualPreset.y
		};

		moveIntoPos(izualCoords, 50);
		let izual = Misc.poll(() => Game.getMonster(sdk.monsters.Izual), 1500, 500);

		izual ? moveIntoPos(izual, 60) : print("izual unit not found");

		let returnSpot = {
			x: me.x,
			y: me.y
		};

		Pather.makePortal() && this.log("clear");
		Attack.securePosition(me.x, me.y, 30, 3000);
		this.log("1");

		while (!this.playerIn()) {
			delay(200);
		}

		Attack.kill(sdk.monsters.Izual);
		Pickit.pickItems();
		this.log("2");
		Pather.moveToUnit(returnSpot);

		while (this.playerIn()) {
			delay(200);
		}

		Pather.usePortal(null, null);

		return true;
	};

	this.givewps = function () {
		if (!AutoRush.RushConfig.GiveWps) return false;

		let wpsLeft = wpsToGive.slice(0);
		console.log(JSON.stringify(wpsLeft));

		wpsLeft.forEach(function (wp) {
			Town.checkScrolls(sdk.items.TomeofTownPortal) <= 5 && (Pather.useWaypoint(sdk.areas.townOf(me.area)) || Town.goToTown()) && Town.doChores();
			Pather.useWaypoint(wp);
		});

		return true;
	};

	console.log(sdk.colors.LightGold + "Loading ClassicRushThread");

	let command = "";
	let current = 0;
	let commandsplit = "";
	let check = -1;
	let sequence = [
		"cain", "andariel", "radament", "cube", "amulet", "staff", "summoner", "duriel", "lamesen",
		"travincal", "mephisto", "izual", "diablo", "givewps"
	];

	this.scriptEvent = function (msg) {
		if (typeof msg === "string") {
			command = msg;
		}
	};

	addEventListener("scriptmsg", this.scriptEvent);

	// START
	Config.init(false);
	Pickit.init(false);
	Attack.init();
	Storage.Init();
	CraftingSystem.buildLists();
	Runewords.init();
	Cubing.init();

	Config.MFLeader = false;

	while (true) {
		if (command) {
			switch (command) {
				case "go":
					// Stop all profile when were done in hell
					if (me.diff == 2 && current >= sequence.length) {
						delay(3000);
						this.log("we're done");
						console.log("Current sequence length: " + current + " sequence length: " + sequence.length);

						while (Misc.getPlayerCount() > 1) {
							delay(1000);
						}

						D2Bot.stop();
						break;
					}
					// End run if entire sequence is done
					if (me.diff <= 1 && current >= sequence.length) {
						delay(3000);
						this.log("bye ~");
						console.log("Current sequence length: " + current + " sequence length: " + sequence.length);

						while (Misc.getPlayerCount() > 1) {
							delay(1000);
						}

						scriptBroadcast("quit");

						break;
					}

					Town.doChores();

					try {
						this[sequence[current]]();
					} catch (sequenceError) {
						this.log(sequenceError.message);
						this.log("2");
						Town.goToTown();
					}

					current += 1;
					command = "go";

					break;
				default:
					if (typeof command === "string") {
						if (command.split(" ")[0] !== undefined && command.split(" ")[0] === "skiptoact") {
							if (!isNaN(parseInt(command.split(" ")[1], 10))) {
								switch (parseInt(command.split(" ")[1], 10)) {
									case 2:
										current = sequence.indexOf("andariel") + 1;
										Town.goToTown(2);

										break;
									case 3:
										current = sequence.indexOf("duriel") + 1;
										Town.goToTown(3);

										break;
									case 4:
										current = sequence.indexOf("mephisto") + 1;
										Town.goToTown(4);

										break;
								}
							}

							command = "";
						} else if (command.split(" ")[0] !== undefined && command.split(" ")[0] === "clear") {
							this.clearArea(Number(command.split(" ")[1]));
							Town.goToTown();

							command = "go";
						} else if (command.split(" ")[0] !== undefined && command.split(" ")[0] === "highestquest") {
							command.split(" ")[1] !== undefined && (commandsplit = command.split(" ")[1]);
							check = sequence.findIndex(i => i === commandsplit);
							check > -1 && (current = check + 1);

							command = "";
						} else {
							for (let i = 0; i < sequence.length; i += 1) {
								if (command && sequence[i].match(command, "gi")) {
									current = i;

									break;
								}
							}

							Town.goToTown();

							command = "go";

							break;
						}
					}

					break;
			}
		}

		delay(100);
	}
}

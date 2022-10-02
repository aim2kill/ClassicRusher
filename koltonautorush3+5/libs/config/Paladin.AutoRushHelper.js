// Paladin config file

/* 
* Note: Dont touch anything else beside
* Attack, Town, Potion, Chicken & Pickit(aleast pick up gold) setting
*/

include("autorush.js");

function LoadConfig() {

	// User addon script. Read the description in libs/bots/UserAddon.js
	Scripts.UserAddon = false; // !!!YOU MUST SET THIS TO FALSE IF YOU WANT TO RUN BOSS/AREA SCRIPTS!!!

	// Battle orders script - Use this for 2+ characters (for example BO barb + sorc)
	Scripts.BattleOrders = true;
		Config.BattleOrders.Mode = 1; // 0 = give BO, 1 = get BO
		Config.BattleOrders.Idle = false; // Idle until the player that received BO leaves.
		Config.BattleOrders.Getters = []; // List of players to wait for before casting Battle Orders (mode 0). All players must be in the same area as the BOer.
		Config.BattleOrders.QuitOnFailure = false; // Quit the game if BO fails
		Config.BattleOrders.SkipIfTardy = true; // Proceed with scripts if other players already moved on from BO spot
		Config.BattleOrders.Wait = 10; // Duration to wait for players to join game in seconds (default: 10)

	Scripts.AutoRushHelper = true;

	// ############################# //
	/* ##### LEECHING SETTINGS ##### */
	// ############################# //
	/*
	* Unless stated otherwise, leader's character name isn't needed on order to run.
	* Don't use more scripts of the same type! (Run AutoBaal OR BaalHelper, not both)
	*/

	Config.Leader = ""; // Leader's ingame character name. Leave blank to try auto-detection (works in AutoBaal, Wakka, MFHelper)
	Config.QuitList = [AutoRush.Rusher.charName, AutoRush.BarbHelper.charName];
	Config.QuitListMode = 0; // 0 = use character names; 1 = use profile names (all profiles must run on the same computer).
	Config.QuitListDelay = []; // Quit the game with random delay in case of using Config.QuitList. Example: Config.QuitListDelay = [1, 10]; will exit with random delay between 1 and 10 seconds.

	// ############################ //
	/* #### CHARACTER SETTINGS #### */
	// ############################ //

	// If Config.Leader is set, the bot will only accept invites from leader.
	// If Config.PublicMode is not 0, Baal and Diablo script will open Town Portals.
	// If set on true, it simply parties.
	Config.PublicMode = 2; // 1 = invite and accept, 2 = accept only, 3 = invite only, 0 = disable.

	// General config
	Config.AutoMap = true; // Set to true to open automap at the beginning of the game.
	Config.WaypointMenu = true; // open waypoint menu, if set to false will use packets to interact
	Config.MinGameTime = 60; // Min game time in seconds. Bot will TP to town and stay in game if the run is completed before.
	Config.MaxGameTime = 0; // Maximum game time in seconds. Quit game when limit is reached.
	Config.LogExperience = false; // Print experience statistics in the manager.

	// Chicken settings
	Config.LifeChicken = 10; // Exit game if life is less or equal to designated percent.
	Config.ManaChicken = 0; // Exit game if mana is less or equal to designated percent.
	Config.MercChicken = 0; // Exit game if merc's life is less or equal to designated percent.
	Config.TownHP = 25; // Go to town if life is under designated percent.
	Config.TownMP = 0; // Go to town if mana is under designated percent.
	Config.PingQuit = [{Ping: 0, Duration: 0}]; // Quit if ping is over the given value for over the given time period in seconds.

	// Town settings
	Config.HealHP = 90; // Go to a healer if under designated percent of life.
	Config.HealMP = 90; // Go to a healer if under designated percent of mana.
	Config.HealStatus = false; // Go to a healer if poisoned or cursed
	Config.UseMerc = false; // Use merc. This is ignored and always false in d2classic.
	Config.MercWatch = false; // Instant merc revive during battle.
	Config.TownCheck = true; // Go to town if out of potions
	Config.StashGold = 10000; // Minimum amount of gold to stash.
	Config.MiniShopBot = false; // Scan items in NPC shops.
	Config.PacketShopping = true; // Use packets to shop. Improves shopping speed.
	Config.CubeRepair = false; // Repair weapons with Ort and armor with Ral rune. Don't use it if you don't understand the risk of losing items.
	Config.RepairPercent = 40; // Durability percent of any equipped item that will trigger repairs.

	// Item identification settings
	Config.CainID.Enable = false; // Identify items at Cain
	Config.CainID.MinGold = 2500000; // Minimum gold (stash + character) to have in order to use Cain.
	Config.CainID.MinUnids = 3; // Minimum number of unid items in order to use Cain.
	Config.FieldID.Enabled = false; // Identify items while in the field
	Config.FieldID.PacketID = true; // use packets to speed up id process (recommended to use this)
	Config.FieldID.UsedSpace = 80; // how much space has been used before trying to field id, set to 0 to id after every item picked
	Config.DroppedItemsAnnounce.Enable = false;	// Announce Dropped Items to in-game newbs
	Config.DroppedItemsAnnounce.Quality = []; // Quality of item to announce. See NTItemAlias.dbl for values. Example: Config.DroppedItemsAnnounce.Quality = [6, 7, 8];

	// Potion settings
	Config.UseHP = 75; // Drink a healing potion if life is under designated percent.
	Config.UseRejuvHP = 45; // Drink a rejuvenation potion if life is under designated percent.
	Config.UseMP = 30; // Drink a mana potion if mana is under designated percent.
	Config.UseRejuvMP = 0; // Drink a rejuvenation potion if mana is under designated percent.
	Config.UseMercHP = 0; // Give a healing potion to your merc if his/her life is under designated percent.
	Config.UseMercRejuv = 0; // Give a rejuvenation potion to your merc if his/her life is under designated percent.
	Config.HPBuffer = 5; // Number of healing potions to keep in inventory.
	Config.MPBuffer = 10; // Number of mana potions to keep in inventory.
	Config.RejuvBuffer = 5; // Number of rejuvenation potions to keep in inventory.

	/* Potion types for belt columns from left to right.
	 * Rejuvenation potions must always be rightmost.
	 * Supported potions - Healing ("hp"), Mana ("mp") and Rejuvenation ("rv")
	 */
	Config.BeltColumn = ["hp", "mp", "rv", "rv"];

	/* Minimum amount of potions from left to right.
	 * If we have less, go to vendor to purchase more.
	 * Set rejuvenation columns to 0, because they can't be bought.
	 */
	Config.MinColumn = [2, 2, 0, 0];

	// ############################ //
	/* #### INVENTORY SETTINGS #### */
	// ############################ //
	/* 
	 * Inventory lock configuration. !!!READ CAREFULLY!!!
	 * 0 = item is locked and won't be moved. If item occupies more than one slot, ALL of those slots must be set to 0 to lock it in place.
	 * Put 0s where your torch, annihilus and everything else you want to KEEP is.
	 * 1 = item is unlocked and will be dropped, stashed or sold.
	 * If you don't change the default values, the bot won't stash items.
	 */
	Config.Inventory[0] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	Config.Inventory[1] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	Config.Inventory[2] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	Config.Inventory[3] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

	// ########################### //
	/* ##### PICKIT SETTINGS ##### */
	// ########################### //
	// Default folder is kolbot/pickit.
	// Item name and classids located in NTItemAlias.dbl or modules/sdk.js

	//Config.PickitFiles.push("kolton.nip");
	//Config.PickitFiles.push("LLD.nip");
	Config.PickitFiles.push("classic.nip"); // Pickit filenames in /pickit/ folder
	Config.PickRange = 40; // Pick radius
	Config.FastPick = false; // Check and pick items between attacks
	Config.OpenChests.Enabled = true; // Open chests. Controls key buying.
	Config.OpenChests.Range = 15; // radius to scan for chests while pathing
	Config.OpenChests.Types = ["chest", "chest3", "armorstand", "weaponrack"]; // which chests to open, use "all" to open all chests. See sdk/chests.txt for full list of chest names

	// ########################### //
	/* ##### PUBLIC SETTINGS ##### */
	// ########################### //

	// ##### CHAT SETTINGS ##### //
	Config.Silence = false; // Make the bot not say a word. Do not use in combination with LocalChat or MFLeader or any team script
	
	// LocalChat messages will only be visible on clients running on the same PC
	// Highly recommened for online play
	// To allow 'say' to use BNET, use 'say("msg", true)', the 2nd parameter will force BNET
	Config.LocalChat.Enabled = false; // use LocalChat system - sends chat locally instead of through BNET
	Config.LocalChat.Toggle = false; // optional, set to KEY value to toggle through modes 0, 1, 2
	Config.LocalChat.Mode = 1; // 0 = disabled, 1 = chat from 'say' (recommended), 2 = all chat (for manual play)

	// Anti-hostile config
	Config.AntiHostile = false; // Enable anti-hostile
	Config.HostileAction = 0; // 0 - quit immediately, 1 - quit when hostile player is sighted, 2 - attack hostile
	Config.TownOnHostile = false; // Go to town instead of quitting when HostileAction is 0 or 1
	Config.RandomPrecast = false; // Anti-PK measure, only supported in Baal and BaalHelper and BaalAssisstant at the moment.
	Config.ViperCheck = false; // Quit if revived Tomb Vipers are sighted
	
	// Party message settings. Each setting represents an array of messages that will be randomly chosen.
	// $name, $level, $class and $killer are replaced by the player's name, level, class and killer
	Config.Greetings = []; // Example: ["Hello, $name (level $level $class)"]
	Config.DeathMessages = []; // Example: ["Watch out for that $killer, $name!"]
	Config.Congratulations = []; // Example: ["Congrats on level $level, $name!"]
	Config.ShitList = false; // Blacklist hostile players so they don't get invited to party.
	Config.UnpartyShitlisted = false; // Leave party if someone invited a blacklisted player.
	Config.LastMessage = ""; // Message or array of messages to say at the end of the run. Use $nextgame to say next game - "Next game: $nextgame" (works with lead entry point)

	// Shrine Scanner - scan for shrines while moving.
	// Put the shrine types in order of priority (from highest to lowest). For a list of types, see sdk/shrines.txt
	Config.ScanShrines = [];

	// DClone config
	Config.StopOnDClone = false; // Go to town and idle as soon as Diablo walks the Earth
	Config.SoJWaitTime = 5; // Time in minutes to wait for another SoJ sale before leaving game. 0 = disabled
	Config.KillDclone = false; // Go to Palace Cellar 3 and try to kill Diablo Clone. Pointless if you already have Annihilus.
	Config.DCloneQuit = true; // 1 = quit when Diablo walks, 2 = quit on soj sales, 0 = disabled

	// Monster skip config
	// Skip immune monsters. Possible options: "fire", "cold", "lightning", "poison", "physical", "magic".
	// You can combine multiple resists with "and", for example - "fire and cold", "physical and cold and poison"
	Config.SkipImmune = [];
	// Skip enchanted monsters. Possible options: "extra strong", "extra fast", "cursed", "magic resistant", "fire enchanted", "lightning enchanted", "cold enchanted", "mana burn", "teleportation", "spectral hit", "stone skin", "multiple shots".
	// You can combine multiple enchantments with "and", for example - "cursed and extra fast", "mana burn and extra strong and lightning enchanted"
	Config.SkipEnchant = [];
	// Skip monsters with auras. Possible options: "fanaticism", "might", "holy fire", "blessed aim", "holy freeze", "holy shock". Conviction is bugged, don't use it.
	Config.SkipAura = [];
	// Uncomment the following line to always attempt to kill these bosses despite immunities and mods
	//Config.SkipException = [getLocaleString(2851), getLocaleString(2852), getLocaleString(2853)]; // vizier, de seis, infector

	// ########################### //
	/* ##### ATTACK SETTINGS ##### */
	// ########################### //

	/* Attack config
	 * To disable an attack, set it to -1
	 * Skills MUST be POSITIVE numbers. For reference see ...\kolbot\sdk\skills.txt or use sdk.skills.SkillName see -> \kolbot\libs\modules\sdk.js
	 * DO NOT LEAVE THE NEGATIVE SIGN IN FRONT OF THE SKILLID.
	 * GOOD: Config.AttackSkill[1] = 56;
	 * GOOD: Config.AttackSkill[1] = sdk.skills.Meteor;
	 * BAD: Config.AttackSkill[1] = -56;
	 * BAD: Config.AttackSkill[1] = "meteor";
	 */
	// Wereform setup. Make sure you read Templates/Attacks.txt for attack skill format.
	Config.Wereform = false; // 0 / false - don't shapeshift, 1 / "Werewolf" - change to werewolf, 2 / "Werebear" - change to werebear

	Config.AttackSkill[0] = -1; // Preattack skill.
	Config.AttackSkill[1] = sdk.skills.BlessedHammer; // Primary skill to bosses.
	Config.AttackSkill[2] = sdk.skills.Concentration; // Primary aura to bosses
	Config.AttackSkill[3] = sdk.skills.BlessedHammer; // Primary skill to others.
	Config.AttackSkill[4] = sdk.skills.Concentration; // Primary aura to others.
	Config.AttackSkill[5] = sdk.skills.HolyBolt; // Secondary skill if monster is immune to primary.
	Config.AttackSkill[6] = sdk.skills.Concentration; // Secondary aura.

	// Low mana skills - these will be used if main skills can't be cast.
	Config.LowManaSkill[0] = -1; // Low mana skill.
	Config.LowManaSkill[1] = -1; // Low mana aura.

	/* Advanced Attack config. Allows custom skills to be used on custom monsters.
	 *	Format: "Monster Name": [attack skill id, aura skill id]
	 *	Multiple entries are separated by commas
	 */
	 Config.CustomAttack = {
		//"Monster Name": [-1, -1]
	};

	// Weapon slot settings
	Config.PrimarySlot = -1; //  primary weapon slot: -1 = disabled (will try to determine primary slot by using non-cta slot that's not empty), 0 = slot I, 1 = slot II
	Config.MFSwitchPercent = 0; // Boss life % to switch to non-primary weapon slot. Set to 0 to disable.
	Config.TeleSwitch = false; // Switch to secondary (non-primary) slot when teleporting more than 5 nodes.

	Config.PacketCasting = 2; // 0 = disable, 1 = packet teleport, 2 = full packet casting. (disables casting animation for increased d2bs stability)
	Config.NoTele = false; // Restrict char from teleporting. Useful for low level/low mana chars
	Config.Dodge = false; // Move away from monsters that get too close. Don't use with short-ranged attacks like Poison Dagger.
	Config.DodgeRange = 15; // Distance to keep from monsters.
	Config.DodgeHP = 90; // Dodge only if HP percent is less than or equal to Config.DodgeHP. 100 = always dodge.
	Config.TeleStomp = false; // Use merc to attack bosses if they're immune to attacks, but not to physical damage

	// ############################ //
	/* ###### CLEAR SETTINGS ###### */
	// ############################ //

	Config.ClearType = 0; // Monster spectype to kill in level clear scripts (ie. Mausoleum). 0xF = skip normal, 0x7 = champions/bosses, 0 = all
	Config.BossPriority = false; // Set to true to attack Unique/SuperUnique monsters first when clearing
	
	// Clear while traveling during bot scripts
	// You have two methods to configure clearing. First is simply a spectype to always clear, in any area, with a default range of 30
	// The second method allows you to specify the areas in which to clear while traveling, a range, and a spectype. If area is excluded from this method,
	// all areas will be cleared using the specified range and spectype
	// Config.ClearPath = 0; // Monster spectype to kill while traveling. 0xF = skip normal, 0x7 = champions/bosses, 0 = all
	// Config.ClearPath = {
	// 	Areas: [74], // Specific areas to clear while traveling in. Comment out to clear in all areas
	// 	Range: 30, // Range to clear while traveling
	// 	Spectype: 0, // Monster spectype to kill while traveling. 0xF = skip normal, 0x7 = champions/bosses, 0 = all
	// };

	// ############################ //
	/* ###### CLASS SETTINGS ###### */
	// ############################ //
	Config.AvoidDolls = false; // Try to attack dolls from a greater distance with hammerdins.
	Config.Vigor = true; // Swith to Vigor when running
	Config.Charge = true; // Use Charge when running
	Config.Redemption = [50, 50]; // Switch to Redemption after clearing an area if under designated life or mana. Format: [lifepercent, manapercent]

	// ########################### //
	/* ##### Gamble SETTINGS ##### */
	// ########################### //
	Config.Gamble = false;
	Config.GambleGoldStart = 1000000;
	Config.GambleGoldStop = 500000;

	// List of item names or classids for gambling. Check libs/NTItemAlias.dbl file for other item classids.
	Config.GambleItems.push("Amulet");
	Config.GambleItems.push("Ring");
	Config.GambleItems.push("Circlet");
	Config.GambleItems.push("Coronet");

	// ########################### //
	/* ##### CUBING SETTINGS ##### */
	// ########################### //
	/* All recipe names are available in Templates/Cubing.txt. For item names/classids check NTItemAlias.dbl
	 * The format is Config.Recipes.push([recipe_name, item_name_or_classid, etherealness]). Etherealness is optional and only applies to some recipes.
	 */
	Config.Cubing = false; // Set to true to enable cubing.
	Config.ShowCubingInfo = true; // Show cubing messages on console

	// Ingredients for the following recipes will be auto-picked, for classids check libs/NTItemAlias.dbl

	//Config.Recipes.push([Recipe.Gem, "Flawless Amethyst"]); // Make Perfect Amethyst
	//Config.Recipes.push([Recipe.Gem, "Flawless Topaz"]); // Make Perfect Topaz
	//Config.Recipes.push([Recipe.Gem, "Flawless Sapphire"]); // Make Perfect Sapphire
	//Config.Recipes.push([Recipe.Gem, "Flawless Emerald"]); // Make Perfect Emerald
	//Config.Recipes.push([Recipe.Gem, "Flawless Ruby"]); // Make Perfect Ruby
	//Config.Recipes.push([Recipe.Gem, "Flawless Diamond"]); // Make Perfect Diamond
	//Config.Recipes.push([Recipe.Gem, "Flawless Skull"]); // Make Perfect Skull

	// ########################### //
	/* #### RUNEWORD SETTINGS #### */
	// ########################### //
	/* All recipes are available in Templates/Runewords.txt
	 * Keep lines follow pickit format and any given runeword is tested vs ALL lines so you don't need to repeat them
	 */
	Config.MakeRunewords = false; // Set to true to enable runeword making/rerolling

	// #################################### //
	/* #### ADVANCED AUTOMULE SETTINGS #### */
	// #################################### //
	/* 
	 * Trigger - Having an item that is on the list will initiate muling. Useful if you want to mule something immediately upon finding.
	 * Force - Items listed here will be muled even if they are ingredients for cubing.
	 * Exclude - Items listed here will be ignored and will not be muled. Items on Trigger or Force lists are prioritized over this list.
	 *
	 * List can either be set as string in pickit format and/or as number referring to item classids. Each entries are separated by commas.
	 * Example :
	 *  Config.AutoMule.Trigger = [639, 640, "[type] == ring && [quality] == unique # [maxmana] == 20"];
	 *  	This will initiate muling when your character finds Ber, Jah, or SOJ.
	 *  Config.AutoMule.Force = [561, 566, 571, 576, 581, 586, 601];
	 *  	This will mule perfect gems/skull during muling.
	 *  Config.AutoMule.Exclude = ["[name] >= talrune && [name] <= solrune", "[name] >= 654 && [name] <= 657"];
	 *  	This will exclude muling of runes from tal through sol, and any essences.
	 */
	Config.AutoMule.Trigger = [];
	Config.AutoMule.Force = [];
	Config.AutoMule.Exclude = [];

	// ############################### //
	/* #### ITEM LOGGING SETTINGS #### */
	// ############################### //
	// Additional item info log settings. All info goes to \logs\ItemLog.txt
	Config.ItemInfo = true; // Log stashed, skipped (due to no space) or sold items.
	Config.ItemInfoQuality = [6, 7, 8]; // The quality of sold items to log. See NTItemAlias.dbl for values. Example: Config.ItemInfoQuality = [6, 7, 8];

	// Manager Item Log Screen
	Config.LogKeys = false; // Log keys on item viewer
	Config.LogOrgans = true; // Log organs on item viewer
	Config.LogLowRunes = false; // Log low runes (El - Dol) on item viewer
	Config.LogMiddleRunes = false; // Log middle runes (Hel - Mal) on item viewer
	Config.LogHighRunes = true; // Log high runes (Ist - Zod) on item viewer
	Config.LogLowGems = false; // Log low gems (chipped, flawed, normal) on item viewer
	Config.LogHighGems = false; // Log high gems (flawless, perfect) on item viewer
	Config.SkipLogging = []; // Custom log skip list. Set as three digit item code or classid. Example: ["tes", "ceh", 656, 657] will ignore logging of essences.

	// ######################################## //
	/* #### AUTO BUILD/SKILL/STAT SETTINGS #### */
	// ######################################## //
	/* 
	 * AutoSkill builds character based on array defined by the user and it replaces AutoBuild's skill system.
	 * AutoSkill will automatically spend skill points and it can also allocate any prerequisite skills as required.
	 *
	 * Format: Config.AutoSkill.Build = [[skillID, count, satisfy], [skillID, count, satisfy], ... [skillID, count, satisfy]];
	 *	skill - skill id number (see /sdk/skills.txt)
	 *	count - maximum number of skill points to allocate for that skill
	 *	satisfy - boolean value to stop(true) or continue(false) further allocation until count is met. Defaults to true if not specified.
	 *
	 *	See libs/config/Templates/AutoSkillExampleBuilds.txt for Config.AutoSkill.Build examples.
	 */
	Config.AutoSkill.Enabled = false; // Enable or disable AutoSkill system
	Config.AutoSkill.Save = 0; // Number of skill points that will not be spent and saved
	Config.AutoSkill.Build = [];

	/* AutoStat builds character based on array defined by the user and this will replace AutoBuild's stat system.
	 * AutoStat will stat Build array order. You may want to stat strength or dexterity first to meet item requirements.
	 *
	 * Format: Config.AutoStat.Build = [[statType, stat], [statType, stat], ... [statType, stat]];
	 *	statType - defined as string, or as corresponding stat integer. "strength" or 0, "dexterity" or 2, "vitality" or 3, "energy" or 1
	 *	stat - set to an integer value, and it will spend stat points until it reaches desired *hard stat value (*+stats from items are ignored).
	 *	You can also set stat to string value "all", and it will spend all the remaining points.
	 *	Dexterity can be set to "block" and it will stat dexterity up the the desired block value specified in arguemnt (ignored in classic).
	 *
	 *	See libs/config/Templates/AutoStatExampleBuilds.txt for Config.AutoStat.Build examples.
	 */
	Config.AutoStat.Enabled = false; // Enable or disable AutoStat system
	Config.AutoStat.Save = 0; // Number stat points that will not be spent and saved.
	Config.AutoStat.BlockChance = 0; // An integer value set to desired block chance. This is ignored in classic.
	Config.AutoStat.UseBulk = true; // Set true to spend multiple stat points at once (up to 100), or false to spend singe point at a time.
	Config.AutoStat.Build = [];

	// AutoBuild System ( See /d2bs/kolbot/libs/config/Builds/README.txt for instructions )
	Config.AutoBuild.Enabled = false;	//	This will enable or disable the AutoBuild system

	//	The name of the build associated with an existing
	//	template filename located in libs/config/Builds/
	Config.AutoBuild.Template = "BuildName";
	//	Allows script to print messages in console
	Config.AutoBuild.Verbose = true;
	//	Debug mode prints a little more information to console and
	//	logs activity to /logs/AutoBuild.CharacterName._MM_DD_YYYY.log
	//	It automatically enables Config.AutoBuild.Verbose
	Config.AutoBuild.DebugMode = true;
}

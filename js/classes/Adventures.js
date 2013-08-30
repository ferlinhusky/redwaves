/*
	Adventures
*/

var Tutorial = function(){
    this.refID = 1;
    this.title = "Die, said the Basilisk. Die!";
	this.titlecolors = ["red", "black"];
    this.type = "Tutorial";
    this.map = "tutorial_map.txt";
    this.opts = {
		"height": 30,
		"width": 40,
		"items": {
		    "tron_1": [29, 7],
			"tron_2": [11, 5],
			"maddog_1": [14, 21],
			"maddog_2": [18, 21],
			"maddog_3": [22, 21],
			"phyton_1": [7, 16],
			"phyton_2": [8, 16],
			"glory_1": [15, 12],
			"glory_2": [12, 9],
			"coifandkettle_1": [31, 7],
			"scale_1": [31, 7]
		},
		"monsters": {
			"Basilisk_1": [15, 9],
			"Snake_Man_1": [7, 15],
			"Snake_Man_2": [7, 16],
			"Snake_Man_3": [11, 5],
			"Snake_Man_4": [10, 13],
			"Snake_Man_5": [11, 13],
			"Snake_Man_6": [10, 16],
			"Snake_Man_7": [11, 16],
			"Snake_Man_8": [12, 10],
			"Snake_Man_9": [14, 13],
			"Snake_Man_10": [16, 13],
			"Snake_Man_11": [18, 5],
			"Snake_Man_12": [18, 6],
			"Snake_Man_13": [19, 6],
			"Snake_Man_14": [23, 12],
			"Snake_Man_15": [23, 16],
			"Hell_Dog_1": [14, 21],
			"Hell_Dog_2": [18, 21],
			"Hell_Dog_3": [22, 21],
			"Hell_Dog_4": [28, 11],
			"Hell_Dog_5": [32, 11]
		},
		"gold": 500
    };
	this.victory = {
		"type": "kill",
		"value": ["Basilisk", 1] // type and # to kill
	};
    this.events = {
	"preamble": "<p>You and your companions have activated\
	a TIME PORTAL to another time. The time...of the Basilisk! While you hope the\
	next leap will be the leap home, it will probably just lead\
	to more bullshit.</p><p><b>Objective: Kill the Basilisk!</b></p>\
	<p><i>Hint: Watch out for Snakes!</i></p>",
	"meet": {
	    "Basilisk_1":{
			"Basilisk_1": "<p>Die! Die!</p><p>See, truth in advertising.</p><p>Die!</p>s"
	    }
	},
	"win": "<p><b>YOU WIN!</b></p><p>Congratulations! You receive 500 gold for destroying\
	the Basilisk. Why does a Basilisk have 500 gold lying around? Why was there any gold\
	whatsover in that weird little fortress populated with Snake Men and wild dogs? Why did\
	you go in there anyway? Because I told you to? You'll need to do better than that in\
	future. Move it along now.</p>",
	"lose": "<p><b>YOU LOSE!</b></p><p>They say virtue is its own reward. Even if it wasn't\
	it wouldn't matter because all of your characters are super dead.</p>"
    };
    this.status = "enabled";
};

var Monastery = function(){
    this.refID = 2;
    this.title = "Kill, Shaolin Beatniks! Kill!";
	this.titlecolors = ["yellow", "darkorange"];
    this.type = "Monastery";
    this.map = "monastery_map.txt";
    this.opts = {
		"height": 30,
		"width": 39,
		"items": {
			"bowstaff_1": [6, 11],
			"bowstaff_2": [6, 11],
			"phyton_1": [6, 10],
			"glory_1": [19, 11],
			"maddog_1": [17, 4],
			"shuriken_1": [17, 4]
		},
		"monsters": {
			"Shaolin_Archer_1": [29, 15],
			"Shaolin_Archer_2": [9, 12],
			"Shaolin_Bowfighter_1": [5, 13],
			"Shaolin_Bowfighter_2": [7, 13],
			"Shaolin_Initiate_1": [19, 25],
			"Shaolin_Initiate_2": [18, 17],
			"Shaolin_Initiate_3": [20, 17],
			"Shaolin_Initiate_4": [19, 16],
			"Shaolin_Adept_1": [18, 12],
			"Shaolin_Adept_1": [20, 12],
			"Shaolin_Beatnik_1": [19, 3],
			"Shaolin_Beatnik_2": [21, 3],
			"Master_Killer_1": [20, 3]
		},
		"gold": 750
    };
    this.victory = {
		"type": "kill",
		"value": ["Master Killer", 1] // type and # to kill
	};
    this.events = {
	"preamble": "<p>You and your companions find yourselves at the\
	entrance of an incredibly blocky temple complex. A convenient\
	villager tells you of the Shaolin Beatniks who reside within and\
	of their brutal master...the Master Killer!</p><p><b>Objective:\
	Defeat the Master Killer!</b></p>\
	<p><i>Hint: He was the best, so he killed the rest!</i></p>",
	"meet": {
	    "Master_Killer_1":{
		"Master_Killer_1": "Chi...the life energy within all of us.\
		Chi...the energy of nature, the shaper of existence. Chi...\
		rules everything around me."
	    }
	},
	"win": "<p><b>YOU WIN!</b></p><p>Congratulations! You receive 750 gold for defeating\
	the Master Killer. Now the money *did* kind of come from looting what was basically\
	the villagers' stolen goods, but hey, TIME PORTAL.</p>",
	"lose": "<p><b>YOU LOSE!</b></p><p>All of your heads are on pikes outside of\
	the temple complex. The villagers are all super-sad. Good one.</p>"
    };
    this.status = "enabled";
};

var CaveDwellers = function(){
	this.refID = 3;
    this.title = "Cave Dwellers";
	this.titlecolors = ["white", "brown"];
    this.type = "CaveDwellers";
    this.map = "cave_dwellers_map.txt";
    this.opts = {
		"height": 30,
		"width": 40,
		"items": {
			"battleaxe_1": [1, 28],
			"somersetbreastplate_1": [6, 3],
			"phyton_1": [6, 4],
			"phyton_2": [25, 1],
			"maddog_1": [10, 21],
			"tron_1": [26, 14],
			"glory_1": [26, 15],
			"glory_2": [32, 5]
			
		},
		"monsters": {
			"Giant_Leech_1": [1, 5],
			"Giant_Leech_2": [1, 9],
			"Giant_Leech_3": [7, 9],
			"Giant_Leech_4": [13, 24],
			"Giant_Leech_5": [14, 22],
			"Giant_Leech_7": [16, 19],
			"Giant_Leech_6": [17, 22],
			"Giant_Leech_8": [17, 8],
			"Giant_Leech_9": [18, 8],
			"Giant_Leech_10": [20, 19],
			"Giant_Leech_11": [25, 27],
			"Giant_Leech_12": [32, 28],
			"Mole_Person_1": [1, 15],
			"Mole_Person_2": [1, 17],
			"Mole_Person_3": [1, 28],
			"Mole_Person_4": [5, 28],
			"Mole_Person_5": [22, 1],
			"Mole_Person_6": [24, 1],
			"Mole_Person_7": [26, 9],
			"Mole_Person_8": [29, 4],
			"Mole_Person_9": [34, 15],
			"Mole_Person_10": [35, 16],
			"Rock_Lobber_1": [6, 6],
			"Rock_Lobber_2": [7, 26],
			"Rock_Lobber_3": [20, 22],
			"Rock_Lobber_4": [24, 20],
			"Rock_Lobber_5": [25, 11],
			"Rock_Lobber_6": [25, 12],
			"Rock_Lobber_7": [14, 17],
			"Rock_Lobber_8": [14, 18],
			"Rock_Lobber_9": [37, 12],
			"Rock_Lobber_10": [38, 12],
			"Rock_Lobber_11": [7, 16],
			"Zor_1": [17, 10],
			"Sander_1": [32, 6],
			"Invisible_Swordsman_1": [15, 13],
			"Invisible_Swordsman_2": [20, 13],
			"Invisible_Swordsman_3": [31, 6],
			"Invisible_Swordsman_4": [31, 7],
			"Invisible_Swordsman_5": [33, 7],
			"Invisible_Swordsman_6": [34, 6],
			"Invisible_Swordsman_7": [34, 7],
			"Guard_of_Zor_1": [16, 11],
			"Guard_of_Zor_2": [17, 11],
			"Guard_of_Zor_3": [18, 11],
			"Guard_of_Zor_4": [17, 18],
			"Guard_of_Zor_5": [18, 18]
		},
		"gold": 1000
    };
    this.victory = {
		"type": "kill",
		"value": ["Zor", 1] // type and # to kill
	};
    this.events = {
	"preamble": "<p>How much cavern is down here? Miles o' cavern!</p><p><b>Objective:\
	Defeat Zor!</b></p>\
	<p><i>Hint: ATOR</i></p>",
	"meet": {
	    "Zor_1":{
		"Zor_1": "..."
	    }
	},
	"win": "<p><b>YOU WIN!</b></p><p>Congratulations! You receive 1000 gold for defeating\
	Zor.</p>",
	"lose": "<p><b>YOU LOSE!</b></p><p>Ugh!</p>"
    };
    this.status = "enabled";
}

var Adventures = [new Tutorial, new Monastery, new CaveDwellers];

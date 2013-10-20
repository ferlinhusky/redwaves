/*
	Adventures
*/

var Tutorial = function(){
    this.refID = 1;
    this.title = "Faster, Basilisk! Kill! Kill!";
    this.titlecolors = ["red", "black"];
    this.type = "Tutorial";
    this.map = "tutorial_map.txt";
    this.actsq = [
	{
	    s: [30, 9],
	    a: {
		type: "alert",
		func: "Hello, door."
	    }
	}
    ];
    this.opts = {
	"height": 30,
	"width": 40,
	"items": {
		"tron_2": [11, 5],
		"maddog_1": [14, 21],
		"maddog_2": [18, 21],
		"maddog_3": [22, 21],
		"phyton_1": [7, 16],
		"phyton_2": [8, 16],
		"glory_1": [15, 12],
		"glory_2": [12, 9],
		"pointedstick_1": [31, 7]
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
	"npcs": {
	    "Lugner_1": [32,6],
	    "Mildred_1": [5,28],
		"Ena_1": [20,7]
	},
	"gold": 500
    };
	this.victory = {
		"type": "kill",
		"value": ["Basilisk", 1] // type and # to kill
	};
    this.events = {
		"preamble": "<p><a href='javascript:void(0);' onclick='loadfullscreen(\"prologue\");'>Read the Prologue</a></p><p>The door of the Infinity Box opens with a creak.\
		&ldquo;That was some roller coaster ride,&rdquo; {p1} says dryly as {p1-pro}, {p2}, and {p3} step\
		out onto a grassy patch. Before them stands a wide, stone complex.</p>\
		<p>&ldquo;What do you imagine it is? Some kind of castle?&rdquo;, {p2} asks. &ldquo;Too small to be\
		a castle,&rdquo; {p3} quickly responds. &ldquo;It could be a keep.&rdquo;\
		<p>{p1} looks around, glancing quickly over both shoulders. &ldquo;Where's {p0}?&rdquo;</p>\
		<p><i>Hint: Watch out for Snakes!</i></p>",
		"win": "<p>The door of the Infinity Box slams shut. A previously unnoticed sign flashes above the interior\
		doorway - \"TEMPORAL LOOP BROKEN - RECONSTITUTION COMPLETE\". {p0}, {p1}, {p2}, and {p3} stand in silence, looking at the\
		floor as the box around them begins to shake violently, ferrying them who knows where. {p0} looks up\
		and asks over the rumble, &ldquo;Why did I get stuck with the stick?&rdquo;</p>",
		"lose": "<p><b>YOU LOSE!</b></p><p>They say virtue is its own reward. Even if it wasn't\
		it wouldn't matter because all of your characters are super dead.</p>"
    };
    this.status = "enabled";
};

var Monastery = function(){
    this.refID = 2;
    this.title = "Who's the Master?";
	this.titlecolors = ["yellow", "darkorange"];
    this.type = "Monastery";
    this.map = "monastery_map.txt";
    this.actsq = [];
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
		"npcs": {},
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
		of their brutal master.</p>\
		<p><i>Hint: He was the best, so he killed the rest!</i></p>",
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
    this.actsq = [];
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
			"Killer_Shrew_1": [1, 15],
			"Killer_Shrew_2": [1, 17],
			"Killer_Shrew_3": [1, 28],
			"Killer_Shrew_4": [5, 28],
			"Killer_Shrew_5": [22, 1],
			"Killer_Shrew_6": [24, 1],
			"Killer_Shrew_7": [26, 9],
			"Killer_Shrew_8": [29, 4],
			"Killer_Shrew_9": [34, 15],
			"Killer_Shrew_10": [35, 16],
			"Eegah_1": [6, 6],
			"Eegah_2": [7, 26],
			"Eegah_3": [20, 22],
			"Eegah_4": [24, 20],
			"Eegah_5": [25, 11],
			"Eegah_6": [25, 12],
			"Eegah_7": [14, 17],
			"Eegah_8": [14, 18],
			"Eegah_9": [37, 12],
			"Eegah_10": [38, 12],
			"Eegah_11": [7, 16],
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
		"npcs": {},
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
		"win": "<p><b>YOU WIN!</b></p><p>Congratulations! You receive 1000 gold for defeating\
		Zor.</p>",
		"lose": "<p><b>YOU LOSE!</b></p><p>Ugh!</p>"
    };
    this.status = "enabled";
}

var Adventures = [new Tutorial, new Monastery, new CaveDwellers];

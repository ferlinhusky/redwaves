/*
	Adventures
*/

var Tutorial = function(){
    this.title = "Die! Said the Basilisk";
    this.type = "Tutorial";
    this.map = "tutorial_map.txt";
    this.opts = {
	"height": 15,
	"width": 50,
	"monsters": {
		"Basilisk_1": [23,4],
		"Atomic_Freak_1": [25,6],
		"Atomic_Freak_2": [26,6],
		"Atomic_Freak_3": [4,10],
		"Atomic_Freak_4": [4,11],
		"Atomic_Beast_1": [25,8],
		"Atomic_Beast_2": [26,8],
		"Atomic_Beast_3": [46,10],
		"Atomic_Beast_4": [46,11],
		"Hillbilly_Hellion_1": [25,11]
	}
    };
    this.events = {
	"preamble": "<p>You and your companions have activated\
	a TIME PORTAL to another time. While you hope the\
	next leap will be the leap home, it will probably just lead\
	to more bullshit.</p><p><b>Objective: Kill the Basilisk!</b></p>\
	<p><i>Hint: Hillbilly Hellions are drunk, carry shotguns,\
	and are from HELL.</i></p>",
	"meet": {
	    "Basilisk_1":{
		"Basilisk_1": "Die!"
	    }
	},
	"win": "<p><b>YOU WIN!</b></p><p>Congratulations! You receive 500 gold for destroying\
	the Basilisk. Unfortunately when you step into the TIME PORTAL\
	science turns the gold into lead. Fortunately you can spend lead\
	just as easily as gold in the game armory. Unfortunately there is\
	no armory in this game. Better luck next time!</p>",
	"lose": "<p><b>YOU LOSE!</b></p><p>They say virtue is its own reward. Even if it wasn't\
	it wouldn't matter because all of your characters are super dead.</p>"
    };
    this.status = "enabled";
};

var Monastery = function(){
    this.title = "Kill, Shaolin Beatniks! Kill!";
    this.type = "Monastery";
    this.map = "monastery_map.txt";
    this.opts = {
	"height": 15,
	"width": 50,
	"monsters": {
		"Shaolin_Beatnik_1": [5,4],
		"Shaolin_Beatnik_2": [40,3],
		"Shaolin_Beatnik_3": [41,3]
	}
    }
    this.status = "disabled";
};

var Locations = [new Tutorial, new Monastery];
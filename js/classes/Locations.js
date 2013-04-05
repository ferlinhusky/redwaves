/*
	Boards
*/
var Tutorial = function(){
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
    }
};

var Monastery = function(){
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
};
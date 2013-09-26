var Monsters = [];
var Monster = Character.extend({
	init: function(name, type, snamepl, wears, wields, inven, skills, attributes){
		var ofType = "monster";
		this._super(name, type, ofType, wears, wields, inven, skills, attributes);
		
		this.snamepl=	snamepl; // str // screen name plural
		
		this.moveInterval;
		this.path;
		
		this.ID = "monster_" + Monsters.length;
		
		this.targets = [];
		this.target = null;
		this.enemy = "player";
		
		this.thac0 = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
		
		Monsters.push(this);
	},
	killed: function(){
		clearInterval(this.moveInterval);
		if($('.' + this.ID).tooltip()){
                        $('.' + this.ID).tooltip('destroy');
                }
		this._super();
		// If killed on its own turn
		if(World.activePlayer === this){
			World.endturn();
		}
	}
});

// [ 0-head, 1-torso, 2-legs, 3-right hand, 4-left hand, 5-feet]

// ATOMIC BEAST
var Atomic_Beast = Monster.extend({
	init: function(){
    	this._super(
			"Atomic Beast",
			"atomic_beast",
			"Atomic Beasts",
			["","","","","",""],
			[new claws, "","",""],
			[],
			[new radiation],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});

// ATOMIC FREAK
var Atomic_Freak = Monster.extend({
	init: function(){
    	this._super(
			"Atomic Freak",
			"atomic_freak",
			"Atomic Freaks",
			["","","","","",""],
			["","","",""],
			[],
			[new radiation],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});

// BASILISK
var Basilisk = Monster.extend({
	init: function(){
    	this._super(
		"Basilisk",
		"basilisk",
		"Basilisks",
		["","","","","",""],
		[new fangs, new claws, new talons, ""],
		[],
		[new paralyze],
		[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
	
		this.HP = 15;
		this.maxHP = 15;
		
		this.STR = 16;
		this.DEX = 18;
		
		this.movement	=	10;
		this.maxMove	=	10;
		
		this.ac = 0;
  	}
});

// Eegah
var Eegah = Monster.extend({
	init: function(){
    	this._super(
			"Eegah",
			"eegah",
			"Eegahs",
			["", "","","","",""],
			[new hands, new rock, "", ""],
			[],
			[],
			[new STR, new CON, new DEX, new CHA, new INT, new WIS]);
			
			this.ac = -2;
  	}
});

// GHOST DRACULA
var Ghost_Dracula = Monster.extend({
	init: function(){
    	this._super(
			"Ghost Dracula",
			"ghost_dracula",
			"Ghost Draculas",
			["","","","","",""],
			[new fangs, "", "", ""],
			[],
			[new paralyze, new freakout, new drain],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});

// GIANT LEECH
var Giant_Leech = Monster.extend({
	init: function(){
    	this._super(
			"Giant Leech",
			"giant_leech",
			"Giant Leeches",
			["","","","","",""],
			[new sucker, "", "", ""],
			[],
			[],
			[new CON, new STR, new WIS, new INT, new DEX, new CHA]);
  	}
});

// GUARD OF ZOR
var Guard_of_Zor = Monster.extend({
	init: function(){
    	this._super(
			"Guard of Zor",
			"guard_of_zor",
			"Guards of Zor",
			[new vikinghelmet, new leathertunic,"","","",""],
			[new shortsword, "", "", ""],
			[],
			[],
			[new STR, new CON, new DEX, new INT, new WIS, new CHA]);
  	}
});

// HELL DOG
var Hell_Dog = Monster.extend({
	init: function(){
    	this._super(
			"Hell Dog",
			"hell_dog",
			"Hell Dogs",
			["","","","","",""],
			[new fangs, "", "", ""],
			[],
			[new hellfire],
			[new DEX, new STR, new CON, new WIS, new INT, new CHA]);
  	}
});

// HILLBILLY HELLION
var Hillbilly_Hellion = Monster.extend({
	init: function(){
    	this._super(
			"Hillbilly Hellion",
			"hillbilly_hellion",
			"Hillbilly Hellions",
			["","","","","",""],
			[new shotgun, "", "", ""],
			[],
			[new hellfire],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});

// INVISIBLE SWORDSMAN
var Invisible_Swordsman = Monster.extend({
	init: function(){
    	this._super(
			"Invisible Swordsman",
			"invisible_swordsman",
			"Invisible Swordsmen",
			["", new chainmail,"","","",""],
			[new longsword, "", "", ""],
			[],
			[],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});

// MASTER KILLER
var Master_Killer = Monster.extend({
	init: function(){
    	this._super(
		"Master Killer",
		"master_killer",
		"Master Killers",
		["", new robe,"","","",""],
		[new deathgrip, new shuriken, "",""],
		[],
		[new martialarts3, new marksmanship],
		[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
		
		this.HP = 20;
		this.maxHP = 20;
		
		this.STR = 18;
		this.DEX = 20;
		
		this.movement	=	8;
		this.maxMove	=	8;
		
		this.ac = -5;
  	}
});


// Killer Shrew
var Killer_Shrew = Monster.extend({
	init: function(){
    	this._super(
			"Killer Shrew",
			"killer_shrew",
			"Killer Shrews",
			["", "","","","",""],
			[new fangs, "", "", ""],
			[],
			[],
			[new DEX, new INT, new STR, new CON, new WIS, new CHA]);
			
			this.ac = 0;
  	}
});

//SANDER
var Sander = Monster.extend({
	init: function(){
    	this._super(
		"Sander",
		"sander",
		"Sanders",
		["", new robe,"","","",""],
		[new hands, "", "",""],
		[],
		[new necromancy],
		[new INT, new WIS, new DEX, new CON, new CHA, new STR]);
		
		this.HP = 12;
		this.maxHP = 12;
		
		this.INT = 18;
		this.WIS = 18;
		
		this.movement	=	6;
		this.maxMove	=	6;
		
		this.ac = 0;
		
		this.spells = [ new smoke ];
  	}
});

// SHAOLIN MONKS
var Shaolin_Archer = Monster.extend({
	init: function(){
    	this._super(
			"Shaolin Archer",
			"shaolin_archer",
			"Shaolin Archers",
			["", new robe,"","","",""],
			[new hands, new longbow, "",""],
			[],
			[new martialarts2, new marksmanship],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});
var Shaolin_Bowfighter = Monster.extend({
	init: function(){
    	this._super(
			"Shaolin Bowfighter",
			"shaolin_bowfighter",
			"Shaolin Bowfighters",
			["", new robe,"","","",""],
			[new bowstaff, "", "",""],
			[],
			[new martialarts2],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});
var Shaolin_Initiate = Monster.extend({
	init: function(){
    	this._super(
			"Shaolin Initiate",
			"shaolin_initiate",
			"Shaolin Initiates",
			["", new robe,"","","",""],
			[new hands, "", "",""],
			[],
			[new martialarts1],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});
var Shaolin_Adept = Monster.extend({
	init: function(){
    	this._super(
			"Shaolin Adept",
			"shaolin_adept",
			"Shaolin Adepts",
			["", new robe,"","","",""],
			[new hands, "", "",""],
			[],
			[new martialarts2],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});
var Shaolin_Beatnik = Monster.extend({
	init: function(){
    	this._super(
			"Shaolin Beatnik",
			"shaolin_beatnik",
			"Shaolin Beatniks",
			["", new robe,"","","",""],
			[new hands, new shuriken, "",""],
			[],
			[new martialarts3],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});

// Son of Billy the Kid
var Son_of_Billy_the_Kid = Monster.extend({
	init: function(){
    	this._super(
			"Son of Billy the Kid",
			"son_of_billy_the_kid",
			"Sons of Billy the Kid",
			[new cowboyhat,"","","","",""],
			[new sixshooter, "", "", ""],
			[],
			[],
			[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
  	}
});

// SNAKE MAN
var Snake_Man = Monster.extend({
	init: function(){
    	this._super(
			"Snake Man",
			"snake_man",
			"Snake Men",
			["","","","","",""],
			[new fangs, "","", ""],
			[],
			[],
			[new DEX, new STR, new CON, new WIS, new INT, new CHA]);
  	}
});

//ZOR
var Zor = Monster.extend({
	init: function(){
    	this._super(
		"Zor",
		"zor",
		"Zors",
		[new vikinghelmet, new studdedleather,"","","",""],
		[new longsword, "", "",""],
		[],
		[],
		[new STR, new CON, new DEX, new CHA, new INT, new WIS]);
		
		this.HP = 24;
		this.maxHP = 24;
		
		this.movement	=	8;
		this.maxMove	=	8;
  	}
});

// Small Beaumont
// Huge Beaumont
// Demi-Hall
// Arch-Hall
// Incredibly Strange Creature...when killed becomes...Mixed-Up Zombie
// Sinful Dwarf
// Beast of Yucca Flats
// Torgo
// Manos
// Bride of Manos
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
		
		this.thac0 = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
		
		Monsters.push(this);
	},
	switchtounranged: function(){
		// If close range, switch to non-ranged attack
		for(var i=0; i<this.wields.length; i++){
			// Check if carrying a ranged weapon
			if(this.wields[i] != "" && this.wields[i].supclass!="firearm"){
				this.readyWeapon = this.wields[i];
				break;
			}
		}
	},
	checkRanged: function(){
		var range = false;
		var target = "";
		
		// Should eventually add spell-check and return type of attack
		
		// If the path to the target is greater than one sq
		if(this.path.length > 1){
			// Ranged weapon (non-spell) targeting
			for(var i=0; i<this.wields.length; i++){
				// Check if carrying a ranged weapon
				if(this.wields[i].supclass=="firearm"){
					this.readyWeapon = this.wields[i];
					getRange(this, "weapon");
					var howmanyinrange = $('.range .player').length; // how many .player are within .range
					if(howmanyinrange == 0){
						break; // try again next move
					} else {
						// Initiate attack against a player in range
						range = true;
						target = Squares[$('.range .player').closest('.range').attr('data-sid')].occupiedBy;
					}
				} else if (this.wields[i] != ""){
					
				}
			}
		} else { this.switchtounranged(); }
		return { 
			'range': range,
			'target': target
		};
	},
	addTarget: function(t){
		var temptarget = {};
		var isnew = true;
		
		temptarget.type = t.type;
		temptarget.coords = t.coords;
		
		for(var i = 0; i < this.targets.length; i++){
			// If it's a current target, drop the old reference
			if(this.targets[i].type == temptarget.type){
				this.targets.splice(i, 1, temptarget);
				isnew = false;
			}
		}
		
		if(isnew){
			this.targets.push(temptarget);
		}
	},
	removeTarget: function(t){
		for(var i = 0; i < this.targets.length; i++){
			// If it's a current target, splice it out
			if(this.targets[i].type == t.type){
				this.targets.splice(i, 1);
			}
		}
	},
	recalibrate: function(){
		for(var i=0; i<Players.length; i++){
			var cansee = Bresenham(this.coords[0], this.coords[1], Players[i].coords[0], Players[i].coords[1], "monster_target", true);
			if(cansee == true){
				temp_path = astar.search(Squares, getSquare(this.coords), getSquare(Players[i].coords), true, true);
				// Change course if a visible target is closer
				if (temp_path.length < this.path.length && temp_path.length > 0){
					this.path = [];
					// tie up with current position or else will jump ahead
					// push empty spaces in
					for(var j=0; j<this.currMove; j++){
						this.path.push("");
					}
					for(var j=0; j<temp_path.length; j++){
						this.path.push(temp_path[j]);
					}
				}
				// Update visible target player coords
				this.addTarget(Players[i]);
			} else if (Players[i].hasSkill('stealth')){
				this.removeTarget(Players[i]);
			}
		}
	},
	findTarget: function(){		
		var path = [];
		if(Players.length == 0){
			clearInterval(this.moveInterval);
			World.endturn();
		} else {
			var temp_path;
			// If there's a target coord(s)
			if(this.targets.length > 0){
				for(var i=0; i<this.targets.length; i++){
					temp_path = astar.search(Squares, getSquare(this.coords), getSquare(this.targets[i].coords), true);
					if(path.length == 0){
						path = temp_path;
					} else if (path.length > 0 && temp_path.length < path.length && temp_path.length > 0){
						path = temp_path;
					}
				}
			} else {
			// If not, get the nearest player(s), make targets
				for(var i=0; i<Players.length; i++){
					// Only target players you can see
					var cansee = Bresenham(this.coords[0], this.coords[1], Players[i].coords[0], Players[i].coords[1], "monster_target", true);
					if(cansee == true){
						temp_path = astar.search(Squares, getSquare(this.coords), getSquare(Players[i].coords), true);
						if(path.length == 0){
							path = temp_path;
						} else if (path.length > 0 && temp_path.length < path.length && temp_path.length > 0){
							path = temp_path;
						}
						this.addTarget(Players[i]);
					} else if (Players[i].hasSkill('stealth')){
						this.removeTarget(Players[i]);
					}
				}
			}
		}
		return path;
	},
	doTurn: function(){
		var self = this;
		this.path = this.findTarget();
		if (this.path.length == 0){
			World.endturn();
		} else {
			centerOn(this);
			monstersMoving.show('fast');
			if(getMapSq(this.coords).hasClass('lit')){
				monstersMoving.text(this.name + ' moving...');
			} else {
				monstersMoving.text('You hear something moving...');
			}
			this.currMove = 0;
			this.moveInterval = setInterval(function(){self.move();}, 500);
		}
	},
	move: function(){
		if(this.currMove < this.movement && this.paralyzed == 0){
			var i = this.currMove; // readability
			var acost = 1;
			
			// Check ranged attack from this location
			var getRange = this.checkRanged();
			
			// If movement exceeds current path, get a new path
			// Push empty items to simulate one long path
			if(this.path[i] == undefined){
				this.path = this.findTarget();
				if(this.path.length == 0){
					clearInterval(this.moveInterval);
					World.endturn();
				}
				this.path.reverse();
				for(var j=0; j<i; j++){
					this.path.push("");
				}
				this.path.reverse();
			}
	
			var sq = getMapSq([this.path[i].x, this.path[i].y])
			
			this.previousSquare = getSquare(this.coords).id;
			var temp_coords = [];
			temp_coords[0] = this.path[i].x;
			temp_coords[1] = this.path[i].y;
			var temp_square = getSquare(temp_coords);
			
			// If not enough moves to attack, end
			if((getRange.range == true || temp_square.occupiedBy.ofType == "player")
				&& this.movement - this.currMove < 2) {
				clearInterval(this.moveInterval);
				World.endturn();
				return;
			}
			
			if(getRange.range == true){
				Input.weaponOn = true; // For battle to recognize ranged wpn attack
				var battle = new Battle(this, getRange.target);
				Input.weaponOn = false;
				acost = 2;
			} else {
				if(temp_square.occupied) {
					// attack if enemy
					if(temp_square.occupiedBy.ofType == "player"){
						this.wait = true;
						var battle = new Battle(this, temp_square.occupiedBy);
						acost = 2;
					}
				} else {
					// Do movement
					this.coords[0] = this.path[i].x;
					this.coords[1] = this.path[i].y;
					var square = getSquare(this.coords);
					// If can open doors, do it (if necessary)
					if(square.t.type == "closed_door"){
						getMapSq(this.coords).removeClass('closed_door');
						getMapSq(this.coords).addClass('open_door');
						square.t = OpenDoor;
						square.cthru = true;
					}
					this.currentSquare = getSquare(this.coords).id;
					this.locIt(this.currentSquare, this.previousSquare);
					// Set map position
					centerOn(this);
				}
			}
			MO_set(this, acost); // update movement
			this.recalibrate(); // recalibrate targets
		} else {
			clearInterval(this.moveInterval);
			World.endturn();
		}
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
			[new viking, new leather,"","","",""],
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


// MOLE PERSON
var Mole_Person = Monster.extend({
	init: function(){
    	this._super(
			"Mole Person",
			"mole_person",
			"Mole People",
			["", "","","","",""],
			[new claws, "", "", ""],
			[],
			[],
			[new STR, new CON, new INT, new DEX, new WIS, new CHA]);
			
			this.ac = -4;
  	}
});

// ROCK LOBBER
var Rock_Lobber = Monster.extend({
	init: function(){
    	this._super(
			"Rock Lobber",
			"rock_lobber",
			"Rock Lobbers",
			["", "","","","",""],
			[new claws, new rock, "", ""],
			[],
			[],
			[new STR, new CON, new DEX, new INT, new WIS, new CHA]);
			
			this.ac = -2;
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
		[new viking, new studdedleather,"","","",""],
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

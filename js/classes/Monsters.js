var Monsters = [];
var Monster = Character.extend({
	init: function(name, type, snamepl, wears, wields, inven, skills, HP, movement){
		this._super(name, type, wears, wields, inven, skills, HP, movement);
		
		this.snamepl=	snamepl; // str // screen name plural
		
		this.moveInterval;
		this.path;
		
		this.ID = "monster_" + Monsters.length;
		this.ofType = "monster";
		
		this.targets = [];
		this.target = null;
		
		Monsters.push(this);
	},
	checkRanged: function(){
		var range = false;
		var target = "";
		
		// Should eventually add spell-check and return type of attack

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
			}
		}
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
				temp_path = astar.search(Squares, getSquare(this.coords), getSquare(Players[i].coords), false, true);
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
					temp_path = astar.search(Squares, getSquare(this.coords), getSquare(this.targets[i].coords), false);
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
						temp_path = astar.search(Squares, getSquare(this.coords), getSquare(Players[i].coords), false);
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
			
			if(getRange.range == true){
				Input.weaponOn = true; // For battle to recognize ranged wpn attack
				var battle = new Battle(this, getRange.target);
				Input.weaponOn = false;
			} else {
				if(temp_square.occupied) {
					// attack if enemy
					if(temp_square.occupiedBy.ofType == "player"){
						this.wait = true;
						var battle = new Battle(this, temp_square.occupiedBy);
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
			MO_set(this, 1); // update movement
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
			["", new claws, "",""],
			[],
			[new radiation],
			4, 4
		);
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
			3, 5
		);
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
			[new fangs, new claws, "", new talons],
			[],
			[new paralyze],
			20, 10
		);
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
			15, 8
		);
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
			4, 7
		);
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
			["", new shotgun, "", ""],
			[],
			[new hellfire],
			4, 7
		);
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
			["",new shuriken,"",""],
			[],
			[new martialarts, new marksmanship],
			25, 7
		);
  	}
});

// SHAOLIN BEATNIK
var Shaolin_Beatnik = Monster.extend({
	init: function(){
    	this._super(
			"Shaolin Beatnik",
			"shaolin_beatnik",
			"Shaolin Beatniks",
			["", new robe,"","","",""],
			["","","",""],
			[],
			[new martialarts],
			5, 7
		);
  	}
});

// HILLBILLY HELLION
var Son_of_Billy_the_Kid = Monster.extend({
	init: function(){
    	this._super(
			"Son of Billy the Kid",
			"son_of_billy_the_kid",
			"Sons of Billy the Kid",
			[new cowboyhat,"","","","",""],
			["", new sixshooter, "", ""],
			[],
			[],
			4, 8
		);
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
			6, 6
		);
  	}
});
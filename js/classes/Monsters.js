var Monsters = [];
var Monster = Character.extend({
	init: function(name, type, snamepl, wears, wields, inven, skills, HP, movement){
		this._super(name, type, wears, wields, inven, skills, HP, movement);
		
		this.snamepl=	snamepl; // str // screen name plural
		
		this.moveInterval;
		this.path;
		
		this.ID = "monster_" + Monsters.length;
		this.ofType = "monster";
		this.group = Monsters;
		this.group.push(this);
		this.readySpell;
	},
	checkRanged: function(){
		var range = false;
		var target = "";
		this.readySpell = null;
		// Ranged weapon (non-spell) targeting
		for(var i=0; i<this.wields.length; i++){
			// Check if carrying a ranged weapon
			if(this.wields[i].hasOwnProperty('rng')){
				this.readySpell = this.wields[i];
				getSpellRange(this);
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
	findTarget: function(){		
		var path = [];
		if(Players.length == 0){
			clearInterval(this.moveInterval);
			World.endturn();
		} else {
			for(var i=0; i<Players.length; i++){
				temp_path = astar.search(Squares, getSquare(this.coords), getSquare(Players[i].coords), false);
				if(path.length == 0){
					path = temp_path;
				} else if (path.length > 0 && temp_path.length < path.length && temp_path.length > 0){
					path = temp_path;
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
		if(this.currMove < this.movement){
			var i = this.currMove; // readability
			
			// Check ranged attack from this location
			var getRange = this.checkRanged();
			
			// If movement exceeds current path, get a new path
			// Push empty items to simulate one long path
			if(this.path[i] == undefined){
				this.path = this.findTarget();
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
				Input.spellOn = true; // For battle to recognize ranged/spell attack
				var battle = new Battle(this, getRange.target);
				Input.spellOn = false;
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
					this.currentSquare = getSquare(this.coords).id;
					this.locIt(this.currentSquare, this.previousSquare);
					// Set map position
					centerOn(this);
				}
			}
			MO_set(this, 1);
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
			["", new claw, new claw,""],
			[],
			["radiation"],
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
			["", new hand, new hand,""],
			[],
			["radiation"],
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
			[new fangs, new claw, new claw, new talons],
			[],
			["paralyze"],
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
			["paralyze", "freakout", "drain"],
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
			["hellfire"],
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
			["hellfire"],
			4, 7
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
			["", new hand, new hand,""],
			[],
			["martial arts"],
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
			["", new sixshooter, new sixshooter, ""],
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
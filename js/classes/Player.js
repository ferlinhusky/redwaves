var Players = [];
var Player = Character.extend({
	init: function(name, type, wears, wields, inven, skills, HP, movement){
		this._super(name, type, wears, wields, inven, skills, HP, movement);
		this.ID = "player_" + Players.length;
		this.ofType = "player";
		//this.group = Players;
		Players.push(this);
		Party.members.push(this);
		
		this.map="";
		this.updatetable();
	},
	updatetable: function(){
		// Update UI
		var wielding = [];
		for(var i=0; i<this.wields.length; i++){
			if(this.wields[i] != ""){
				wielding.push(this.wields[i].name);
			}
		}
		
		var wearing = [];
		for(var i=0; i<this.wears.length; i++){
			if(this.wears[i] != ""){
				wearing.push(this.wears[i].name);
			}
		}
		$('#party').append('<tr class="'+this.type+' player_row">');
		$('#party tr.'+this.type).append('<td class="member">'+this.name+'</td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="HP">'+this.HP+'</span> <span class="total">('+this.HP+')</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="MO">'+this.movement+'</span> <span class="total">('+this.movement+')</span></td>');
		$('#party tr.'+this.type).append('<td class="stat stWPN"><span class="WPN">'+wielding.toString()+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="ATK">'+this.wields[1].dmg+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="AC">'+this.ac+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat stWEARS"><span class="WEARS">'+wearing.toString()+'</span></td>');
	},
	locIt: function(curr, prev, first){
		this._super(curr, prev);

		// Update line of sight
		if(first != true){
			getLineOfSight(this.coords);
			
			// Check keenness; see characters within 5 squares
			this.checkKeenness();
		}
		
		// Check for doors
		anyDoors(this.coords);
		
		// Wizard check
		if(this.type == "wizard" && Input.spellOn == true){
			getSpellRange(this);
		}
	},
	move: function(dir){
		if(this.wait == false && this.currMove < this.movement){
			var isPassable = true;
			var square;
			this.previousSquare = getSquare(this.coords).id;
			switch(dir){
				case "right": 
					this.coords[0]++;
					square = getSquare(this.coords);
					if(!square || !square.t.passable || square.occupied){
						this.coords[0]--;
						isPassable = false;
					}
					break;
				case "left":
					this.coords[0]--;
					square = getSquare(this.coords);
					if(!square || !square.t.passable || square.occupied){
						this.coords[0]++;
						isPassable = false;
					}
					break;
				case "up":
					this.coords[1]--;
					square = getSquare(this.coords);
					if(!square || !square.t.passable || square.occupied){
						this.coords[1]++;
						isPassable = false;
					}
					break;
				case "down":
					this.coords[1]++;
					square = getSquare(this.coords);
					if(!square || !square.t.passable || square.occupied){
						this.coords[1]--;
						isPassable = false;
					}
					break;
				default: break;
			}
			this.currentSquare = getSquare(this.coords).id;

			//Successful Move
			$('.'+this.ofType).removeClass('blink'); // stop blinking when a player moves
			
			if(isPassable == true){
				if(this.currentSquare != this.previousSquare){
					this.lastDir = dir;
					this.locIt(this.currentSquare, this.previousSquare);
					// Set map position
					centerOn(this);
					
					// Check for items
					if(square.containsA.is == "item"){
						btnPickup.button('enable');
					} else {
						btnPickup.button('disable');
					}
				}

				// Track movement
				MO_set(this, 1);
			} else if (square.occupied){
				if (square.occupiedBy.ofType == "monster"){
					var battle = new Battle(World.activePlayer, square.occupiedBy);
					
					// If paralyzed
					if(this.paralyzed > 0){
						endturnUI();
						// Zero out unused moves for player
						MO_set(this, this.movement - this.currMove);
					} else if(!this.dead){ MO_set(this, 1); } // else if not dead, updated movement
				}
			}
			if (this.currMove == this.movement){
				endturnUI();
			}
		} else if (this.currMove == this.movement){
			endturnUI();
		}
	},
	killed: function(){
		this._super();
		// Trasmit death to monsters in sight
		for(var i=0; i<Monsters.length; i++){
			var cansee = Bresenham(this.coords[0], this.coords[1], Monsters[i].coords[0], Monsters[i].coords[1], "player_killed", true);
			if (cansee) {
				Monsters[i].removeTarget(this);
			}
		}
		// If killed during own turn
		if(World.activePlayer === this){
			unbuildItemMenu();
			MO_zero(this); // Zero out movement
			btnEndTurn.addClass('blink'); // Indicate end turn
		}
	},
	checkKeenness: function(){
		if(this.hasSkill('keenness')){
			var rng = 5;
			var x = new Number(this.coords[0]);
			var y = new Number(this.coords[1]);
			var xSq = [];
				for(var i=-rng; i<=rng; i++) {
					if( x+i >=0 && x+i < World.Level.opts.width  ) { xSq.push(x+i); }
				}
			var ySq = [];
				for(var i=-rng; i<=rng; i++) {
					if( y+i >=0 && y+i < World.Level.opts.height ) { ySq.push(y+i); }
				}
				
			for (i=0; i<ySq.length; i++){
				for (j=0; j<xSq.length; j++){
					var mapsq = getMapSq([xSq[i],ySq[j]]);
					var sq = getSquare([xSq[i],ySq[j]]);
					if(sq.occupied){
						mapsq.removeClass('unlit visited');
						mapsq.addClass('lit');
					}
				}
			}
		}
	}
});

// HERO
var Hero = Player.extend({
	init: function(){ this._super(
		"Hero",
		"hero",
		[new coifandkettle, new scale,"","","",""],
		["", new shortsword,"",""],
		[new phyton],
		// dlb dmg att/half dmg def against big boss (added)
		[new heroism], 8, 6); 
	}
});

// FIGHTER
var Fighter = Player.extend({
	init: function(){ this._super(
		"Fighter",
		"fighter",
		[new barbute, new chainmail,"","","",""],
		["", new longsword,"",""],
		[new phyton],
		// if 2HP or less, 50% chance of getting back 1HP (added)
		[new tenacity], 10, 6); 
	}
});

// KNIGHT
var Knight = Player.extend({
	init: function(){ this._super(
		"Knight",
		"knight",
		[new closehelmet, new plate,"","","",""],
		["", new broadsword,"",""],
		[new glory, new maddog],
		// +n sword damage (added)
		[new swordsmanship], 12, 5);
	}
});

// WIZARD
var Wizard = Player.extend({
	init: function(){ this._super(
		"Wizard",
		"wizard",
		[new leatherhelm, new robe,"","","",""],
		["", new woodenstaff,"",""],
		[],
		// half spell dmg (added)
		[new necromancy], 4, 6);
		
		this.spells = [
			new fireball,
			new freeze,
			new lightning,
			new earthquake
		];
		
		for(var i=0; i<this.spells.length; i++){
			menuSelectSpell.append('<li><a href="javascript:void(0);" onclick="Input.setSpell('+i+');">'+this.spells[i].name);
		}
		
		// Create spell menu
		menuSelectSpell.menu();
	}
});

// Wolfman
var Wolfman = Player.extend({
	init: function(){ this._super(
		"Wolfman",
		"wolfman",
		["",new hide,"","","",""],
		[new fangs, new claw, new claw, ""],
		[new tron],
		// see hidden characters up to 5 sq away (added)
		[new keenness], 6, 12);
  	}
});

// LAMIA
var Lamia = Player.extend({
	init: function(){this._super(
		"Lamia",
		"lamia",
		["","","","","",""],
		[new fangs, new claw, new claw, ""],
		[],
		// chance of paralyzing enemy for n turns (added)
		[new paralyze, new aquatic], 8, 5);
  	}
});

// THIEF
var Thief = Player.extend({
	init: function(){ this._super(
		"Thief",
		"thief",
		[new leatherhelm, new leathertunic,"","","",""],
		["", new dagger, new dagger,""],
		[new maddog],
		// drops from monster target list when out of sight (added)
		[new stealth], 8, 5);
	}
});
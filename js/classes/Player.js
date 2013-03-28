var Players = [];
var Player = Character.extend({
	init: function(name, type, wears, wields, inven, skills, HP, movement){
		this._super(name, type, wears, wields, inven, skills, HP, movement);
		this.ID = Players.length;
		this.ofType = "player";
		this.group = Players;
		this.group.push(this);
		
		// Update UI
		$('#party').append('<tr class="'+this.type+'">');
		$('#party tr.'+this.type).append('<td class="member">'+this.name+'</td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="HP">'+this.HP+'</span> <span class="total">('+this.HP+')</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="MO">'+this.movement+'</span> <span class="total">('+this.movement+')</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="WPN">'+this.wields[1].name+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="ATK">'+this.wields[1].dmg+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="AC">'+this.ac+'</span></td>');
		
		var wearing = [];
		for(var i=0; i<wears.length; i++){
			if(wears[i] != ""){
				wearing.push(wears[i].name);
			}
		}
		
		$('#party tr.'+this.type).append('<td class="stat"><span class="WEARS">'+wearing.toString()+'</span></td>');
		
		formatPartyTable();
	},
	locIt: function(curr, prev){
		this._super(curr, prev);

		// Update line of sight
		getLineOfSight(this.coords);
		
		// Check for doors
		anyDoors(this.coords);
		
		// Wizard check
		if(this.type == "wizard" && input.spellOn == true){
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
				this.lastDir = dir;

				this.locIt(this.currentSquare, this.previousSquare);
				// Set map position
				centerOn(this);

				// Track movement
				MO_set(this, 1);
			} else if (square.occupied){
				if (square.occupiedBy.ofType == "monster"){
					var battle = new Battle(me, square.occupiedBy);
					
					// Track/update movement if not dead
					if(!this.dead){ MO_set(this, 1); }
				}
			}
			if (this.currMove == this.movement){
				btnEndTurn.addClass('blink');
			}
		} else if (this.currMove == this.movement){
			btnEndTurn.addClass('blink');
		}
	},
	killed: function(){
		this._super();
		// If killed during own turn
		if(World.activePlayer === this){
			MO_zero(this); // Zero out movement
			btnEndTurn.addClass('blink'); // Indicate end turn
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
		[],
		[], 8, 4); 
	}
});

// FIGHTER
var Fighter = Player.extend({
	init: function(){ this._super(
		"Fighter",
		"fighter",
		[new barbute, new chainmail,"","","",""],
		["", new longsword,"",""],
		[],
		[], 10, 6); 
	}
});

// KNIGHT
var Knight = Player.extend({
	init: function(){ this._super(
		"Knight",
		"knight",
		[new closehelmet, new plate,"","","",""],
		["", new broadsword,"",""],
		[],
		[], 12, 5);
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
		[], 4, 6);
	}
});
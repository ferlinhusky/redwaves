var Players = [];
var Player = Character.extend({
	init: function(name, type, wears, wields, inven, skills, attributes){
		this._super(name, type, wears, wields, inven, skills, attributes);
		this.ID = "player_" + Players.length;
		this.ofType = "player";
		this.map = "";

		Players.push(this);
		Party.members.push(this);
		
		this.updatetable();
	},
	updatetable: function(){
		// Get latest AC
		this.getAC();
		
		// Update UI
		var wielding = [];
		var wieldingdmg = [];
		for(var i=0; i<this.wields.length; i++){
			if(this.wields[i] != ""){
				wielding.push(this.wields[i].name);
				wieldingdmg.push(this.wields[i].dmg);
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
		$('#party tr.'+this.type).append('<td class="stat"><span class="ATK">'+ wieldingdmg +'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="AC">'+this.ac+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat stWEARS"><span class="WEARS">'+wearing.toString()+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="STR">'+this.STR.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="DEX">'+this.DEX.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="CON">'+this.CON.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="INT">'+this.INT.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="WIS">'+this.WIS.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="CHA">'+this.CHA.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="lvl">'+this.level+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat"><span class="xp">'+this.XP+'</span></td>');
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
		
		// Spell check
		if(Input.spellOn == true){
			getRange(this, "spell");
		}
		
		// Range check
		if(Input.weaponOn == true){
			getRange(this, "weapon");
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
			} else if (square.occupied && this.movement >= 2){
				if (square.occupiedBy.ofType == "monster"){
					var battle = new Battle(World.activePlayer, square.occupiedBy);
					
					// If paralyzed
					if(this.paralyzed > 0){
						this.endturnUI();
						// Zero out unused moves for player
						MO_set(this, this.movement - this.currMove);
					} else if(!this.dead){ MO_set(this, 2); } // else if not dead, updated movement
				}
			}
			if (this.currMove == this.movement){
				this.endturnUI();
			}
		} else if (this.currMove == this.movement){
			this.endturnUI();
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
	},
	endturnUI: function(){
		btnEndTurn.addClass('blink');
		btnSpell.removeClass('blink')
			.button('disable');
		btnSelectSpell.button('disable');
		btnWeapon.removeClass('blink')
			.button('disable');
		btnSelectWeapon.button('disable');
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
		[new heroism],
		[new STR, new CON, new CHA, new WIS, new DEX, new INT]); 
	}
});

// FIGHTER
var Fighter = Player.extend({
	init: function(){ this._super(
		"Fighter",
		"fighter",
		[new barbute, new chainmail,"","","",""],
		["", new longsword,new crossbow,""],
		[new phyton],
		// if 2HP or less, 50% chance of getting back 1HP (added)
		[new tenacity, new marksmanship],
		[new CON, new STR, new DEX, new WIS, new INT, new CHA]); 
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
		[new swordsmanship],
		[new CHA, new STR, new CON, new DEX, new WIS, new INT]);
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
		[new necromancy],
		[new INT, new WIS, new DEX, new CON, new CHA, new STR]);
		
		this.spells = [
			new fireball,
			new freeze,
			new lightning,
			new earthquake
		];
	}
});

// Wolfman
var Wolfman = Player.extend({
	init: function(){ this._super(
		"Wolfman",
		"wolfman",
		["",new hide,"","","",""],
		[new fangs, new claws, "", ""],
		[new tron],
		// see hidden characters up to 5 sq away (added)
		[new keenness],
		[new STR, new DEX, new CON, new WIS, new CHA, new INT]);
  	}
});

// HARPY
var Harpy = Player.extend({
	init: function(){this._super(
		"Harpy",
		"harpy",
		["","","","","",""],
		[new fangs, new claws, "", ""],
		[],
		// chance of paralyzing enemy for n turns (added)
		[new paralyze, new aquatic],
		[new WIS, new CHA, new DEX, new STR, new CON, new INT]);
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
		[new stealth],
		[new DEX, new INT, new CHA, new WIS, new CON, new STR]);
	}
});

// YOUNG PRIEST
var Youngpriest = Player.extend({
	init: function(){ this._super(
		"Young Priest",
		"youngpriest",
		["", new robe,"","","",""],
		["", new maul,"",""],
		[],
		// half spell dmg (added)
		[new tenacity],
		[new CON, new CHA, new INT, new STR, new DEX, new WIS]);
		
		this.spells = [ new heal ];
	}
});

// OLD PRIEST
var Oldpriest = Player.extend({
	init: function(){ this._super(
		"Old Priest",
		"oldpriest",
		["", new robe,"","","",""],
		["", new mace,"",""],
		[],
		// half spell dmg (added)
		[new necromancy],
		[new WIS, new CHA, new INT, new CON, new STR, new DEX]);
		
		this.spells = [ new healall ];
	}
});
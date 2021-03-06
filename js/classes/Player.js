var Players = [];
var Player = Character.extend({
	init: function(name, type, wears, wields, inven, skills, attributes){
		var ofType = "player";
		this._super(name, type, ofType, wears, wields, inven, skills, attributes);
		this.ID = "player_" + Players.length;
		this.map = "";
		this.enemy = "monster";

		Players.push(this);
		Party.members.push(this);
		
		this.updatetable();
	},
	updateWpn: function(){
		$('#party tr.'+this.type+' .WPN').text(this.readyWeapon.name);
		$('#party tr.'+this.type+' .ATK').text(this.readyWeapon.dmg);	
	},
	updateArmor: function(){
		var wearing = [];
		for(var i=0; i<this.wears.length; i++){
			if(this.wears[i] != ""){
				wearing.push(this.wears[i].name);
			}
		}
		$('#party tr.'+this.type+' .WEARS').text(wearing.join(', '));
		
		// Update armor class accordingly
		this.updateAC();
	},
	updateAC: function(){
		this.getAC();
		$('#party tr.'+this.type+' .AC').text(this.ac);
	},
	updatetable: function(){
		// Get latest AC
		this.getAC();
		
		// Update UI
		$('#party').append('<tr class="'+this.type+' player_row">');
		$('#party tr.'+this.type).append('<td class="member landoff">'+this.name+'</td>');
		$('#party tr.'+this.type).append('<td class="stat landoff"><span class="HP">'+this.HP+'</span> <span class="total">('+this.HP+')</span></td>');
		$('#party tr.'+this.type).append('<td class="stat landoff"><span class="MO">'+this.movement+'</span> <span class="total">('+this.movement+')</span></td>');
		$('#party tr.'+this.type).append('<td class="stat roff"><span class="WPN"></span></td>');
		$('#party tr.'+this.type).append('<td class="stat landoff"><span class="ATK"></span></td>');	
			this.updateWpn();
		$('#party tr.'+this.type).append('<td class="stat landoff"><span class="AC">'+this.ac+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat roff"><span class="WEARS"></span></td>');
			this.updateArmor();
		$('#party tr.'+this.type).append('<td class="stat roff"><span class="STR">'+this.STR.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat roff"><span class="DEX">'+this.DEX.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat roff"><span class="CON">'+this.CON.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat roff"><span class="INT">'+this.INT.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat roff"><span class="WIS">'+this.WIS.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat roff"><span class="CHA">'+this.CHA.v+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat landoff"><span class="lvl">'+this.level+'</span></td>');
		$('#party tr.'+this.type).append('<td class="stat roff"><span class="xp">'+this.XP+'</span></td>');
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
		anyNPCs(this.coords);
		
		// Spell check
		if(Input.spellOn == true){
			getRange(this, "spell");
		}
		
		// Range check
		if(Input.weaponOn == true){
			getRange(this, "weapon");
		}
	},
	doMove: function(square, dir, acost){
		if(this.currentSquare != this.previousSquare){
			this.lastDir = dir;
			this.locIt(this.currentSquare, this.previousSquare);
			
			// Center map
			centerOn(this);
			
			// Check for items
			checkPickupBtn();
			
			// Check for Infinity Box
			checkInfinityBox();
			
			// Check for actions
			if(square.action != null){
				var sa = square.action;
				switch(sa.type){
					case "alert":
						Statuss.update("<div class='sq_alert'>" + sa.func + "</div>");
						square.action = null;
						break;
					default: break;
				}
			}
		}

		// Track all action costs here
		MO_set(this, acost);
	},
	move: function(dir, cost){
		// How many remaining
		var remaining_move = this.movement - this.currMove;
			
		var acost = 1;
		if(cost > 1) { acost = cost; }
		
		if(this.wait == false && remaining_move >= 1){
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
				case "right_up" :
					this.coords[0]++;
					this.coords[1]--;
					square = getSquare(this.coords);
					if(!square || !square.t.passable || square.occupied || remaining_move < 1.5){
						this.coords[0]--;
						this.coords[1]++;
						isPassable = false;
					} else { acost = 1.5; }
					break;
				case "right_down" :
					this.coords[0]++;
					this.coords[1]++;
					square = getSquare(this.coords);
					if(!square || !square.t.passable || square.occupied || remaining_move < 1.5){
						this.coords[0]--;
						this.coords[1]--;
						isPassable = false;
					} else { acost = 1.5; }
					break;
				case "left_up" :
					this.coords[0]--;
					this.coords[1]--;
					square = getSquare(this.coords);
					if(!square || !square.t.passable || square.occupied || remaining_move < 1.5){
						this.coords[0]++;
						this.coords[1]++;
						isPassable = false;
					} else { acost = 1.5; }
					break;
				case "left_down" :
					this.coords[0]--;
					this.coords[1]++;
					square = getSquare(this.coords);
					if(!square || !square.t.passable || square.occupied || remaining_move < 1.5){
						this.coords[0]++;
						this.coords[1]--;
						isPassable = false;
					} else { acost = 1.5; }
					break;
				default: break;
			}
			this.currentSquare = getSquare(this.coords).id;

			//Successful Move
			$('.'+this.ofType).removeClass('blink'); // stop blinking when a player moves
			
			if(isPassable == true && remaining_move >= 1){
				this.doMove(square, dir, acost);
			} else if (square.occupied && this.movement - this.currMove >= 2){
				if (square.occupiedBy.ofType != "player"){
					var battle = new Battle(World.activePlayer, square.occupiedBy);
					
					// If paralyzed
					if(this.paralyzed > 0){
						this.endturnUI();
						// Zero out unused moves for player
						MO_set(this, this.movement - this.currMove);
					} else if(!this.dead && battle.success){ this.handleactioncost("weapon"); } // else if not dead, update with battle action cost (2)
				} 
			}
			if (this.movement - this.currMove < 1){
				this.endturnUI();
			}
		} else if (this.movement - this.currMove < 1){
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
	endturnUI: function(){ btnEndTurn.addClass('blink'); },
        handleactioncost: function(type){
		switch(type){
			case "spell": 	this.move(false, 2); break;
			case "ranged": 	this.move(false, 2); break;
			case "weapon":	this.move(false, 2); break;
			default: break;
		}
        }
});

// HERO
var Hero = Player.extend({
	init: function(){ this._super(
		"Hero",
		"hero",
		["",new sackcloth,"","","",""],
		["","","",""],
		[],
		[new heroism, new swordsmanship],
		[new STR, new CON, new CHA, new WIS, new DEX, new INT]);
	
		this.spellsList = [
			{ 5: new lightning },
			{ 10: new freeze }
		];
		
		this.thac0 = [20, 20, 19, 19, 18, 17, 17, 16, 16, 15, 14, 14, 13, 13, 12, 11, 11, 10, 10, 9];
	}
});

// FIGHTER
var Fighter = Player.extend({
	init: function(){ this._super(
		"Fighter",
		"fighter",
		[new barbute, new chainmail,"","","",""],
		[new longsword,new crossbow,"",""],
		[],
		[new tenacity, new marksmanship, new swordsmanship],
		[new CON, new STR, new DEX, new WIS, new INT, new CHA]);
	
		this.thac0 = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
	}
});

// KNIGHT
var Knight = Player.extend({
	init: function(){ this._super(
		"Knight",
		"knight",
		[new closehelmet, new plate,"","","",""],
		[new broadsword,"","",""],
		[],
		[new swordsmanship],
		[new CHA, new STR, new CON, new DEX, new WIS, new INT]);
	
		this.spellsList = [
			{ 10: new fireball }
		];
	
		this.thac0 = [20, 19, 19, 18, 17, 16, 16, 15, 14, 13, 13, 12, 11, 10, 10, 9, 8, 7, 7, 6];
	}
});

// WIZARD
var Wizard = Player.extend({
	init: function(){ this._super(
		"Wizard",
		"wizard",
		[new leatherhelm, new robe,"","","",""],
		[new woodenstaff,"","",""],
		[],
		// half spell dmg (added)
		[new necromancy],
		[new INT, new WIS, new DEX, new CON, new CHA, new STR]);
		
		this.spells = [ new lightning ];
		
		this.spellsList = [
			{ 0: new lightning },
			{ 1: new freeze },
			{ 2: new fireball },
			{ 3: new earthquake }
		];
		
		this.thac0 = [20, 20, 20, 19, 19, 19, 18, 18, 18, 17, 17, 17, 16, 16, 16, 15, 15, 15, 14, 14];
	}
});

// Wolfman
var Wolfman = Player.extend({
	init: function(){ this._super(
		"Wolfman",
		"wolfman",
		["","","","","",""],
		[new claws, new fangs, "", ""],
		[new tron],
		[new keenness],
		[new STR, new DEX, new CON, new WIS, new CHA, new INT]);
	
		this.thac0 = [20, 18, 17, 16, 14, 13, 12, 10, 9, 8, 6, 5, 4, 2, 1, 0, -2, -3, -4, -6];
  	}
});

// HARPY
var Harpy = Player.extend({
	init: function(){this._super(
		"Harpy",
		"harpy",
		["","","","","",""],
		[new claws, new fangs, "", ""],
		[],
		[new paralyze, new aquatic],
		[new WIS, new CHA, new DEX, new STR, new CON, new INT]);
	
		this.thac0 = [20, 19, 19, 18, 17, 17, 16, 15, 15, 14, 13, 13, 12, 11, 11, 10, 9, 9, 8, 7];
  	}
});

// THIEF
var Thief = Player.extend({
	init: function(){ this._super(
		"Thief",
		"thief",
		[new leatherhelm, new leathertunic,"","","",""],
		[new dagger, "","",""],
		[],
		[new stealth],
		[new DEX, new INT, new CHA, new WIS, new CON, new STR]);
	
		this.thac0 = [20, 20, 19, 19, 18, 18, 17, 17, 16, 16, 15, 15, 14, 14, 13, 13, 12, 12, 11, 11];
	}
});

// YOUNG PRIEST
var Youngpriest = Player.extend({
	init: function(){ this._super(
		"Young Priest",
		"youngpriest",
		["", new robe,"","","",""],
		[new maul,"","",""],
		[],
		[new tenacity],
		[new CON, new CHA, new INT, new STR, new DEX, new WIS]);
		
		this.spells = [ new heal ];
		
		this.thac0 = [20, 20, 18, 18, 16, 16, 14, 14, 12, 12, 10, 10, 8, 8, 6, 6, 4, 4, 2, 2];
	}
});

// OLD PRIEST
var Oldpriest = Player.extend({
	init: function(){ this._super(
		"Old Priest",
		"oldpriest",
		["", new robe,"","","",""],
		[new mace,"","",""],
		[],
		[new necromancy],
		[new WIS, new CHA, new INT, new CON, new STR, new DEX]);
		
		this.spells = [ new healall ];
		
		this.thac0 = [20, 20, 20, 18, 18, 18, 16, 16, 16, 14, 14, 14, 12, 12, 12, 10, 10, 10, 8, 8];
	}
});

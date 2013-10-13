var Dead = [];
var Characters = [];
var Character = Class.extend({
	rollattributes: function(){
		var rolltotals = [];
		
		// Generate 6 attribute rolls
		for (var j=0; j<6; j++) {
			var rolls = [];
			var total = 0;
			
			// Roll 4 times, keep three best
			for (var i=0; i<4; i++) {
				// 1-6
				rolls.push(Math.floor(Math.random()*6)+1);
			}
			// Sort descending
			rolls.sort(function(a,b){return b-a});
			// Chop off lowest
			rolls.splice(3,1);
			// Add it up
			for (var i=0; i<3; i++) {
				total += rolls[i];
			}
			rolltotals.push(total);
		}
		
		// Sort rolltotals descending
		rolltotals.sort(function(a,b){return b-a});
		
		for(var j=0; j<6; j++){
			// Set as attribute values
			this.attributes[j].base = rolltotals[j];
			this.attributes[j].v = rolltotals[j];
		}
	},
	levelup: function(lvl){
		// Update level
		this.level = lvl;
		
		/*
		 *	Primary skill +2
		 *	Secondary skills +1
		 *	Tertiary skills alt +1
		 */
		
		lvl--;

		this.attributes[0].v = this.attributes[0].base + (2*lvl);
		this.attributes[1].v = this.attributes[1].base + lvl;
		this.attributes[2].v = this.attributes[2].base + lvl;
		if (lvl%2 == 0) {
			this.attributes[3].v = this.attributes[3].base + (lvl/2);
			this.attributes[4].v = this.attributes[4].base + (lvl/2);
			this.attributes[5].v = this.attributes[5].base + (lvl/2);	
		}
	},
	calcstats: function(){
		// Calc level by XP here
			/*
			 *	 1: 0
			 *	 2: 10
			 *	 3: 20
			 *	 4: 40
			 *	 5: 80
			 *	 6: 150
			 *	 7: 225
			 *	 8: 300
			 *	 9: 375
			 *	10: 450
			 *	11: 550
			 *	12: 650
			 *	13: 800
			 *	14: 950
			 *	15: 1100
			 *	16: 1250
			 *	17: 1400
			 *	18: 1600
			 *	19: 1800
			 *	20: 2047
			 */
			
		if (this.XP < 10) { this.levelup(1); }
		else if (this.XP < 20) { this.levelup(2); }
		else if (this.XP < 40) { this.levelup(3); }
		else if (this.XP < 80) { this.levelup(4); }
		else if (this.XP < 150) { this.levelup(5); }
		else if (this.XP < 225) { this.levelup(6); }
		else if (this.XP < 300) { this.levelup(7); }
		else if (this.XP < 375) { this.levelup(8); }
		else if (this.XP < 450) { this.levelup(9); }
		else if (this.XP < 550) { this.levelup(10); }
		else if (this.XP < 650) { this.levelup(11); }
		else if (this.XP < 800) { this.levelup(12); }
		else if (this.XP < 950) { this.levelup(13); }
		else if (this.XP < 1100) { this.levelup(14); }
		else if (this.XP < 1250) { this.levelup(15); }
		else if (this.XP < 1400) { this.levelup(16); }
		else if (this.XP < 1600) { this.levelup(17); }
		else if (this.XP < 1800) { this.levelup(18); }
		else if (this.XP < 2047) { this.levelup(19); }
		else if (this.XP >= 2047) { this.levelup(20); }
		
		// Calc HP
		this.HP = Math.floor((this.CON.v + Math.floor(this.STR.v/2) + this.level)/2);
		this.maxHP = this.HP;
		
		// Calc movement
		var minMove;
		switch (this.ofType) {
			case "monster"	: minMove = 3; break;
			case "player"	: minMove = 6; break;
			case "npc"		: minMove = 4; break;
			default			: break;
		}
		this.movement	=	minMove + this.DEX.mod();
		this.maxMove	=	this.movement;
		
		// Calc armor class
		this.getAC();
	},
	init: function(name, type, ofType, wears, wields, inven, skills, attributes){
		// XP, name and type
		this.XP 	= 	0;
		this.name	=	name; // str // screen name
		this.type	=	type; // str // in-program cat
		this.ofType	=	ofType // str // player, monster
		
		// AI Moving, Targeting, and Pathing
		this.moveInterval;
		this.path;
		this.targets = [];
		this.target = null;
		
		// Get Attribute values
		this.attributes = attributes;
		this.rollattributes();
		
		// Set Attribute values to character
		for (var i=0; i<6; i++) {
			switch (this.attributes[i].name) {
				case "STR": this.STR = this.attributes[i]; break;
				case "CON": this.CON = this.attributes[i]; break;
				case "CHA": this.CHA = this.attributes[i]; break;
				case "WIS": this.WIS = this.attributes[i]; break;
				case "INT": this.INT = this.attributes[i]; break;
				case "DEX": this.DEX = this.attributes[i]; break;
					default: break;
			}
		}

		// Set weapons, armor
		this.wears	=	wears; // array // [ 0-helmet, 1-body armor, 2-shield, 3-gloves, 4-boots, 5-charm]
		this.wields	=	wields; // array // [ 0-face, 1-right hand, 2-left hand, 3-feet ]
		
		// Make sure something is being wielded
		this.checkwielding();
		
		// Set inventory, skills, spells
		this.inven	=	inven; // array // [ item, item, ... ]
		this.skills	=	skills; // array // [ skill, skill, ... ]
		this.skillnames = [];
			// Be sure that if skills are updated at any time during a session, that skillnames[] gets updated as well
			for (var i=0; i<this.skills.length; i++) {
				this.skillnames.push(this.skills[i].name);
			}
		this.spells = []; // array // [ { name : f(x) }, ... ]
		
		// Set ready weapon, start w/hands then face then feet
		if(this.wields[0] != ""){
			this.readyWeapon = this.wields[0];
		} else if(this.wields[1] != ""){
			this.readyWeapon = this.wields[1];
		} else if(this.wields[2] != ""){
			this.readyWeapon = this.wields[2];
		} else if(this.wields[3] != ""){
			this.readyWeapon = this.wields[3];
		}
		
		// Set ready item, spell, ranged
		this.readyItem = null;
		this.readySpell = null;
		this.readyRanged = null;
		
		// Set medications
		this.medication = []; // any herbs or pills taken

		// Map placement
		this.coords = [];
		this.currMove = 0;

		// Physical effects
		this.wait = true;
		this.paralyzed = 0;
		this.slow = false;
		this.dead = false;
		
		// Calc stats
		this.calcstats();
		
		// Get gender
		if(this.type == "wolfman"){ this.gender = setGender("male");
		} else if (this.type == "harpy"){ this.gender = setGender("female");
		} else {
			var prob = Math.ceil(Math.random()*10);
			if(prob > 5){ this.gender = setGender("male");
			} else { this.gender = setGender("female"); }
		}
		
		Characters.push(this);
	},
	checkwielding: function(){
		if (this.wields.join("").length == 0) {
			this.wields[0] = new hands;
		}
	},
	getAC: function(){
		var tempac = 0;
		for(var i=0; i<this.wears.length; i++){
			if(this.wears[i] != ""){
				tempac += this.wears[i].ac;
			}
		}
		this.ac = 10 - (-tempac + this.DEX.mod());	
	},
	hasSkill:  function(s){
		if($.inArray(s, this.skillnames) > -1){
			return true;
		} else { return false; }
	},
	locIt: function(curr, prev){
		// Set character position
		Squares[curr].occupied = true;
		Squares[curr].occupiedBy = this;
		
		var current = Squares[curr].onMap;
		var previous;
		var loc = [Squares[curr].x, Squares[curr].y];
		this.coords = loc;
		this.currentSquare = getSquare(this.coords).id;
		
		// Remove character from previous square
		if(prev != undefined){
			Squares[prev].occupied = false;
			Squares[prev].occupiedBy = "";
			
			previous = Squares[prev].onMap;
			//findAndRemove(previous, '.p', this.ofType + ' ' + this.type + ' ' + this.ID);
			$('.' + this.type + '.' + this.ID).removeClass(this.ofType + ' ' + this.type + ' ' + this.ID);
		}
		// Add character to current square
		findAndAdd(current, '.p', this.ofType + ' ' + this.type + ' ' + this.ID);
		
		if(getMapSq(this.coords).hasClass('lit') && this.ofType == 'monster'){
			monstersMoving.text(this.name + ' moving...');
		} else {
			monstersMoving.text('You hear something moving...');
		}
	},
	killed: function(){
		// Drop everything (except limbs)
		for (var i=0; i<this.wears.length; i++) {
			if (this.wears[i] != "") { this.wears[i].drop(this, this.currentSquare); }
		}
		for (var i=0; i<this.wields.length; i++) {
			if (this.wields[i] != "" && this.wields[i].supclass != "appendage") { this.wields[i].drop(this, this.currentSquare); }
		}
		for (var i=0; i<this.inven.length; i++) {
			this.inven[i].drop(this, this.currentSquare);
		}
		
		// Set vars
		this.dead = true;
		this.movement = 0;
		Dead.push(this);
		
		var cChar = cloneToOverlay(this);
		findAndRemove(Squares[this.currentSquare].onMap, '.p', this.type + ' ' + this.ofType); // reset UI
		cChar.fadeOut('slow', function(){
			$(this).remove();
		});
		
		Squares[this.currentSquare].occupied = false; // empty Square obj
		Squares[this.currentSquare].occupiedBy = "";
		
		var group;
		switch (this.ofType) {
			case "monster"	: group = Monsters; break;
			case "player"	: group = Players; break;
			case "npc"		: group = NPCs; break;
			default			: break;
		}
		
		// Remove from array; can't just splice at ID b/c ID->position changes on a splice
		for(var i=0; i<group.length; i++){
			if(this.ID == group[i].ID){
				group.splice(i, 1);
				break; // end loop
			}
		}
		
		// If victory character, bring on the Infinity Box
		if(this.name == World.Level.victory.value[0]){
			Squares[this.currentSquare].onMap.addClass('infinity_box');
			World.infinitybox = true;
			Statuss.update("<div class='sq_alert'>The Infinity Box appears where your enemy fell!<br/>Enter it and press the flashing &#946;</div>");
		}
	},
	doTurn: function(){
		var self = this;
		// Remove killed targets
		for(var i=0; i<this.targets.length; i++){
			if(this.targets[i].dead == true){
				this.removeTarget(this.targets[i]);
			}
		}
		// Find new targets
		this.path = this.findTarget();
		// Begin turn
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
			this.moveInterval = setInterval(function(){self.move_MONNPC();}, 500);
		}
	},
	move_MONNPC: function(){
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
			if((getRange.range == true || temp_square.occupiedBy.ofType == this.enemy)
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
					if(temp_square.occupiedBy.enemy != this.enemy){
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
					var howmanyinrange = $('.range .'+this.enemy).length; // how many .player are within .range
					if(howmanyinrange == 0){
						break; // try again next move
					} else {
						// Initiate attack against a player in range
						range = true;
						target = Squares[$('.range .'+this.enemy).closest('.range').attr('data-sid')].occupiedBy;
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
		
		/*for(var i = 0; i < this.targets.length; i++){
			// If it's a current target, drop the old reference
			if(this.targets[i].type == temptarget.type){
				this.targets.splice(i, 1, temptarget);
				isnew = false;
			}
		}*/
		
		for(var i = 0; i < this.targets.length; i++){
			// If it's a current target, drop the old reference
			if(this.targets[i] === t){
				this.targets.splice(i, 1);
				isnew = false;
			}
		}
		
		if(isnew){
			//this.targets.push(temptarget);
			this.targets.push(t);
		}
	},
	removeTarget: function(t){
		for(var i = 0; i < this.targets.length; i++){
			// If it's a current target, splice it out
			//if(this.targets[i].type == t.type){
			if(this.targets[i] === t){
				this.targets.splice(i, 1);
			}
		}
	},
	findEnemies: function(){
		var Enemies = [];
		for(var i=0; i<Characters.length; i++){
			if(Characters[i].enemy != this.enemy && Characters[i].dead != true){
				Enemies.push(Characters[i]);
			}
		}
		return Enemies;
	},
	recalibrate: function(){
		var Enemies = this.findEnemies();
		for(var i=0; i<Enemies.length; i++){
			var cansee = Bresenham(this.coords[0], this.coords[1], Enemies[i].coords[0], Enemies[i].coords[1], "monster_target", true);
			if(cansee == true){
				temp_path = astar.search(Squares, getSquare(this.coords), getSquare(Enemies[i].coords), true, true);
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
				this.addTarget(Enemies[i]);
			} else if (Enemies[i].hasSkill('stealth')){
				this.removeTarget(Enemies[i]);
			}
		}
	},
	findTargetPath: function(p, t){
		temp_path = astar.search(Squares, getSquare(this.coords), getSquare(t.coords), true);
		if(p.length == 0){
			p = temp_path;
		} else if (p.length > 0 && temp_path.length < p.length && temp_path.length > 0){
			p = temp_path;
		}
		return p;
	},
	findTarget: function(){
		var Enemies = this.findEnemies();
		var path = [];
		if(Enemies.length == 0){
			clearInterval(this.moveInterval);
			World.endturn();
		} else {
			var temp_path;
			// If there's a target coord(s)
			if(this.targets.length > 0){
				for(var i=0; i<this.targets.length; i++){
					path = this.findTargetPath(path, this.targets[i]);
				}

			} else {
				// If not, get the nearest player(s), make targets
				for(var i=0; i<Enemies.length; i++){
					// Only target players you can see
					var cansee = Bresenham(this.coords[0], this.coords[1], Enemies[i].coords[0], Enemies[i].coords[1], "monster_target", true);
					if(cansee == true){
						path = this.findTargetPath(path, Enemies[i]);
						this.addTarget(Enemies[i]);
					} else if (Enemies[i].hasSkill('stealth')){
						this.removeTarget(Enemies[i]);
					}
				}
			}
		}
		return path;
	},
	updateWpn: function(){ return; },
	updateAC: function(){ return; },
	updateArmor: function(){ return; },
	updatetable: function(){ return; },
});

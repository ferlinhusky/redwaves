var Dead = [];
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
	updateWpn: function(){ return; },
	updateAC: function(){ return; },
	updateArmor: function(){ return; },
	updatetable: function(){ return; },
});

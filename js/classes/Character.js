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
			// Set as attribute value
			this.attributes[j].v = total;
		}
	},
	init: function(name, type, wears, wields, inven, skills, attributes, movement){
		this.level = 1;
		
		this.name	=	name; // str // screen name
		this.type	=	type; // str // in-program cat
		
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

		this.wears	=	wears; // array // [ 0-head, 1-torso, 2-hands, 3-feet]
		this.wields	=	wields; // array // [ 0-face, 1-right hand, 2-left hand, 3-feet ]
		
		this.checkwielding();
		
		this.inven	=	inven; // array // [ item, item, ... ]
		this.skills	=	skills; // array // [ skill, skill, ... ]
		this.skillnames = [];
			// Be sure that if skills are updated at any time during a session, that skillnames[] gets updated as well
			for (var i=0; i<this.skills.length; i++) {
				this.skillnames.push(this.skills[i].name);
			}
		this.spells = []; // array // [ { name : f(x) }, ... ]
		
		this.HP = Math.floor((this.CON.v + Math.floor(this.STR.v/2) + this.level)/2);
		this.maxHP = this.HP;
		
		this.movement	=	movement;
		this.maxMove	=	movement;
		
		// Set ready weapon, start w/hands then face then feet
		if(this.wields[1] != ""){
			this.readyWeapon = this.wields[1];
		} else if(this.wields[2] != ""){
			this.readyWeapon = this.wields[2];
		} else if(this.wields[0] != ""){
			this.readyWeapon = this.wields[0];
		} else if(this.wields[3] != ""){
			this.readyWeapon = this.wields[3];
		}
		this.readyItem = null;
		this.readySpell = null;
		this.readyRanged = null;
		
		this.medication = []; // any herbs or pills taken

		this.coords = [];
		this.currMove = 0;

		this.wait = true;
		this.paralyzed = 0;
		this.slow = false;
		this.dead = false;
		
		this.getAC();
		
		// Get gender
		if(this.type == "wolfman"){ this.gender = setGender("male");
		} else if (this.type == "lamia"){ this.gender = setGender("female");
		} else {
			var prob = Math.ceil(Math.random()*10);
			if(prob > 5){ this.gender = setGender("male");
			} else { this.gender = setGender("female"); }
		}
	},
	checkwielding: function(){
		if (this.wields.join("").length == 0) {
			this.wields[1] = new hands;
		}
	},
	getAC: function(){
		var tempac = 0;
		for(var i=0; i<this.wears.length; i++){
			if(this.wears[i] != ""){
				tempac += this.wears[i].ac;
			}
		}
		this.ac = 10 + tempac;	
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
			findAndRemove(previous, '.p', this.ofType + ' ' + this.type + ' ' + this.ID);
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
			default			: break;
		}
		
		// Remove from array; can't just splice at ID b/c ID->position changes on a splice
		for(var i=0; i<group.length; i++){
			if(this.ID == group[i].ID){
				group.splice(i, 1);
				break; // end loop
			}
		}
	}
});
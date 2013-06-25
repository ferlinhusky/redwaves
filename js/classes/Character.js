var Dead = [];
var Character = Class.extend({
	init: function(name, type, wears, wields, inven, skills, HP, movement){
		this.name	=	name; // str // screen name
		this.type	=	type; // str // in-program cat

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
		
		this.HP		=	HP;
		this.maxHP	=	HP;
		this.movement	=	movement;
		this.maxMove	=	movement;
		
		this.readyItem = null;
		this.readySpell = null;
		this.readyRanged = null;
		
		this.medication = []; // any herbs or pills taken

		this.coords = [];
		this.currMove = 0;

		this.level = 1;
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
			this.wields[1] = new hand;
			this.wields[2] = new hand;
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
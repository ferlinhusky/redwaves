var Dead = [];
var Character = Class.extend({
	init: function(name, type, wears, wields, inven, skills, HP, movement){
		this.name	=	name; // str // screen name
		this.type	=	type; // str // in-program cat

		this.wears	=	wears; // array // [ 0-head, 1-torso, 2-legs, 3-right hand, 4-left hand, 5-feet]
		this.onhead 	=	wears[0];
		this.onbody	=	wears[1];
		this.onlegs 	=	wears[2];
		this.rhand	=	wears[3];
		this.lhand	=	wears[4];
		this.onfeet 	=	wears[5];
		
		this.wields	=	wields; // array // [ 0-face, 1-right hand, 2-left hand, 3-feet ]
		
		this.inven	=	inven; // array // [ item, item, ... ]
		this.skills	=	skills; // array // [ { name : dmg/rng }, ... ]
		this.skillnames = [];
			// Be sure that if skills are updated at any time during a session, that skillnames[] gets updated as well
			for (var i=0; i<this.skills.length; i++) {
				this.skillnames.push(this.skills[i].name);
			}	
		this.HP		=	HP;
		this.maxHP	=	HP;
		this.movement	=	movement;
		this.maxMove	=	movement;
		
		this.readyItem = null;
		this.spells = [];
		this.medication = []; // any herbs or pills taken

		this.coords = [];
		this.currMove = 0;

		this.level = 1;
		this.wait = true;
		this.paralyzed = 0;
		this.slow = false;
		this.dead = false;
		
		var tempac = 0;
		for(var i=0; i<this.wears.length; i++){
			if(this.wears[i] != ""){
				tempac += this.wears[i].ac;
			}
		}
		this.ac = 10 + tempac;
		
		// Get gender
		if(this.type == "wolfman"){
			this.gender = {
				"demo": "male",
				"type": "man",
				"pro": "him",
				"ppro": "his"
			}; 
		} else if (this.type == "lamia"){
			this.gender = {
				"demo": "female",
				"type": "woman",
				"pro": "her",
				"ppro": "her"
			};
		} else {
			var prob = Math.ceil(Math.random()*10);
			if(prob > 5){
				this.gender = {
					"demo": "male",
					"type": "man",
					"pro": "him",
					"ppro": "his"
				}; 
			} else {
				this.gender = {
					"demo": "female",
					"type": "woman",
					"pro": "her",
					"ppro": "her"
				};
			}
		}
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
		
		// Remove from array; can't just splice at ID b/c ID->position changes on a splice
		for(var i=0; i<this.group.length; i++){
			if(this.ID == this.group[i].ID){
				this.group.splice(i, 1);
				break; // end loop
			}
		}
		delete this; // remove object
	}
});
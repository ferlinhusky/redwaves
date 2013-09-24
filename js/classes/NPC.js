var NPCs = [];
var NPC = Character.extend({
	init: function(name, type, snamepl, wears, wields, inven, skills, attributes){
		var ofType = "npc";
		this._super(name, type, ofType, wears, wields, inven, skills, attributes);
		
		this.snamepl=	snamepl; // str // screen name plural
		
		this.ID = "npc_" + NPCs.length;
		
		this.targets = [];
		this.target = null;
		this.scriptnum = 0;
		this.killconfirm = 0;
		
		this.thac0 = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
		
		NPCs.push(this);
	},
	talk: function(){
		Statuss.update(this.script[this.scriptnum]);
		this.scriptnum++;
		// Repeat last sentence ad infinitum
		if(this.scriptnum >= this.script.length){
			this.scriptnum = this.script.length-1;	
		}
	},
	give: function(){
		return;	
	},
	joinPlayers: function(){
		Statuss.update('<span class="join_alert">'+this.name+' joins you!</span>');
		/*
		 * 0. Add into World rotation of play directly after player
		 * 1. Look around for closest: player, monster, or item
		 * 2. If player, move towards; if monster, move/attack
			--- Should make the following into Character functions since Monsters may need to take advantage of them too ---
		 * 3. If item closer than nearest monster and better than current, move towards first and pick up...
		 * 4. ...then continue towards player/monster
		 * 5. If HP < 5 and has a healing potion, use it; if no medications and one in inventory, use it
		 */
		return;
	},
	joinMonsters: function(){
		return;
	},
	killed: function(){
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

// LŸgner
var Lugner = NPC.extend({
	init: function(){
		this._super(
			"L&#252;gner",
			"lugner",
			"L&#252;gners",
			["",new sackcloth,"","","",""],
			[new hands, "", "", ""],
			[],
			[],
			[new CON, new STR, new WIS, new DEX, new INT, new CHA]);
		
		this.HP = 1;
		this.maxHP = 1;
		
		this.movement	=	0;
		this.maxMove	=	0;
		
		this.script = [
			"I am still L&#252;gner, have you forgotten?",
			"You look different. Am I going crazy?",
			"No, I'm perfectly sane. You're the crazy one.",
			"We're just waiting to die.",
			"Your friend Olaf? The Basilisk has taken him.",
			"Soon it will be us. You can leave, but the end will be the same.",
			"Take the stick with you, I'm sure it will help.",
			"If you make it to Schlaraffenland...",
			"tell my wife I died a hero.",
			"*mumbles incoherently*"
		]
  	}
});

// Ena
var Ena = NPC.extend({
	init: function(){
		this._super(
			"Ena",
			"ena",
			"Enas",
			["",new sackcloth,"","","",""],
			[new hands, "", "", ""],
			[],
			[],
			[new WIS, new CHA, new STR, new CON, new INT, new DEX]);
		
		this.script = [
			"Are you the adventurers here to slay the Basilisk?",
			"It has taken so many from our village.",
			"It took my daughter Mildred two weeks ago!",
			"Please save her, I know she must be alive.",
			"She's strong like me when I was her age.",
			"You must save her or I'll go myself!",
			"May the blessing of Master Friam be with you."
		]
  	},
	talk: function(){
		this._super();
		if (this.scriptnum == 2) {
			this.joinPlayers();
		}
	}
});

// Mildred
var Mildred = NPC.extend({
	init: function(){
		this._super(
			"Mildred",
			"mildred",
			"Mildreds",
			["",new sackcloth,"","","",""],
			[new hands, "", "", ""],
			[],
			[],
			[new DEX, new CHA, new STR, new INT, new CON, new WIS]);
		
		this.script = [
			"My mother sent you?!",
			"Fine, I'll come with you.",
			"Drop me a weapon when you can.",
			"Stop talking, I'm trying to adventure."
		]
  	}
});
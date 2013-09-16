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

// L�gner
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

// Villager
var Villager = NPC.extend({
	init: function(){
    	this._super(
    		"Villager",
    		"villager",
    		"Villagers",
    		["","","","","",""],
    		[new hands, "", "", ""],
    		[],
    		[],
    		[new CON, new STR, new WIS, new DEX, new INT, new CHA]);
    	
    		this.HP = 4;
    		this.maxHP = 4;
    		
    		this.movement	=	5;
    		this.maxMove	=	5;
  	}
});

var Skill = Class.extend({
	init: function(name, refID){
		this.name = name;
		this.refID = refID;
	}
});

// Heroism
var heroism = Skill.extend({ init: function(){ this._super("heroism", 34); } });

// Tenacity
var tenacity = Skill.extend({ init: function(){ this._super("tenacity", 35); } });

// Swordsmanship
var swordsmanship = Skill.extend({ init: function(){ this._super("swordsmanship", 36); } });

// Necromancy
var necromancy = Skill.extend({ init: function(){ this._super("necromancy", 37); } });

// Keenness
var keenness = Skill.extend({ init: function(){ this._super("keenness", 38); } });

// Paralyze
var paralyze = Skill.extend({ init: function(){ this._super("paralyze", 39); } });

// Stealth
var stealth = Skill.extend({ init: function(){ this._super("stealth", 40); } });
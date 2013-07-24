var Skill = Class.extend({
	init: function(name, refID){
		this.name = name;
		this.refID = refID;
	}
});

// Heroism
var heroism = Skill.extend({ init: function(){ this._super("heroism", 1); } });

// Tenacity
var tenacity = Skill.extend({ init: function(){ this._super("tenacity", 2); } });

// Swordsmanship
var swordsmanship = Skill.extend({ init: function(){ this._super("swordsmanship", 3); } });

// Necromancy
var necromancy = Skill.extend({ init: function(){ this._super("necromancy", 4); } });

// Keenness
var keenness = Skill.extend({ init: function(){ this._super("keenness", 5); } });

// Paralyze
var paralyze = Skill.extend({ init: function(){ this._super("paralyze", 6); } });

// Stealth
var stealth = Skill.extend({ init: function(){ this._super("stealth", 7); } });

// Aquatic
var aquatic = Skill.extend({ init: function(){ this._super("aquatic", 8); } });

// Hellfire
var hellfire = Skill.extend({ init: function(){ this._super("hellfire", 9); } });

// Martial Arts
var martialarts1 = Skill.extend({ init: function(){ this._super("martialarts1", 10); } });
var martialarts2 = Skill.extend({ init: function(){ this._super("martialarts2", 11); } });
var martialarts3 = Skill.extend({ init: function(){ this._super("martialarts3", 12); } });

// Freakout
var freakout = Skill.extend({ init: function(){ this._super("freakout", 13); } });

// Radiation
var radiation = Skill.extend({ init: function(){ this._super("radiation", 14); } });

// Drain
var drain = Skill.extend({ init: function(){ this._super("drain", 15); } });

// Marksmanship
var marksmanship = Skill.extend({ init: function(){ this._super("marksmanship", 16); } });
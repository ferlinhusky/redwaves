var Weapon = Item.extend({
	init: function(name, type, supclass, dmg, material, twohand, refID){
		this._super(name, type, "weapon", supclass, material, refID); // push up to Item
		this.dmg = dmg;
		this.twohand = twohand;
		this.wieldin = "hand";
		if (isNaN(this.dmg)) {
			var wpn_dmg = new Number(this.dmg.split('d')[1]);
		} else { wpn_dmg = this.dmg; }
		this.price = Math.floor(wpn_dmg*120);
	}
});

// Axe subclass
var Axe = Weapon.extend({
	init: function(name, type, dmg, material, twohand, refID){
		this._super(name, type, "axe", dmg, material, twohand, refID);
	}
});

// Battle axe
var battleaxe = Axe.extend({ init: function(){ this._super("Battle axe", "battleaxe", "1d12", "steel", true, 14); } });

// Club subclass
var Club = Weapon.extend({
	init: function(name, type, dmg, material, twohand, refID){
		this._super(name, type, "club", dmg, material, twohand, refID);
	}
});

// Mace
var mace = Club.extend({ init: function(){ this._super("Mace", "mace", "1d5", "iron", false, 18); } });

// Maul
var maul = Club.extend({ init: function(){ this._super("Maul", "maul", "1d7", "iron", false, 19); } });


// Sword subclass
var Sword = Weapon.extend({
	init: function(name, type, dmg, material, twohand, refID){
		this._super(name, type, "sword", dmg, material, twohand, refID);
	}
});

// Dagger
var dagger = Sword.extend({ init: function(){ this._super("Dagger", "dagger", "1d3", "steel", false, 1); } });

// Long sword
var longsword = Sword.extend({ init: function(){ this._super("Long sword", "longsword", "1d6", "steel", false, 2); } });

// Short sword
var shortsword = Sword.extend({ init: function(){ this._super("Short sword", "shortsword", "1d4", "steel", false, 3); } });

// Broad sword
var broadsword = Sword.extend({ init: function(){ this._super("Broad sword", "broadsword", "1d10", "steel", true, 4); } });

// Pointed stick
var pointedstick = Sword.extend({ init: function(){ this._super("Pointed stick", "pointedstick", "1d2", "wood", true, 23); } });

// Staff subclass
var Staff = Weapon.extend({
	init: function(name, type, dmg, material, refID){
		this._super(name, type, "staff", dmg, material, true, refID);
	}
});

// Wooden Staff
var woodenstaff = Staff.extend({ init: function(){ this._super("Wooden staff", "woodenstaff", "1d2", "wood", 5); } });

// Bow Staff
var bowstaff = Staff.extend({ init: function(){ this._super("Bow staff", "bowstaff", "1d4", "wood", 17); } });


// Appendage subclass
var Appendage = Weapon.extend({
	init: function(name, type, dmg, material, refID){
		this._super(name, type, "appendage", dmg, material, false, refID);
	}
});

// Fangs
var fangs = Appendage.extend({ init: function(){ this._super("Fangs", "fangs", "1d6", "bone", 6); } });

// Hand
var hands = Appendage.extend({ init: function(){ this._super("Hands", "hands", "2d1", "flesh", 7); } });

// Claw
var claws = Appendage.extend({ init: function(){ this._super("Claws", "claws", "2d4", "flesh", 8); } });

// Death Grip
var deathgrip = Appendage.extend({ init: function(){ this._super("Death grip", "deathgrip", "2d5", "flesh", 16); } });

// Talons
var talons = Appendage.extend({ init: function(){ this._super("Talons", "talons", "2d4", "bone", 9); } });

// Sucker
var sucker = Appendage.extend({ init: function(){ this._super("Sucker", "sucker", "1d4", "flesh", 22); } });

// Firearm subclass
var Firearm = Weapon.extend({
	init: function(name, type, dmg, dmg_cl, rng, material, twohand, refID){
		this._super(name, type, "firearm", dmg, material, twohand, refID);
		this.rng = rng;
		this.dmg_cl = dmg_cl; // Close range damage
	}
});

// Crossbow
var crossbow = Firearm.extend({ init: function(){ this._super("Crossbow", "crossbow", "1d4", "1d2", 3, "wood", true, 10); } });

// English Longbow
var longbow = Firearm.extend({ init: function(){ this._super("Longbow", "longbow", "1d3", "1d1", 5, "steel", true, 11); } });

// Shotgun
var shotgun = Firearm.extend({ init: function(){ this._super("Shotgun", "shotgun", "1d12", "1d2", 6, "steel", true, 12); } });

// Six shooter
var sixshooter = Firearm.extend({ init: function(){ this._super("Six shooter", "sixshooter", "1d7", "1d1", 8, "steel", false, 13); } });

// Shuriken
var shuriken = Firearm.extend({ init: function(){ this._super("Shuriken", "shuriken", "3d3", "1d1", 4, "steel", false, 15); } });

// Geometric Nucleus
var geometricnucleus = Firearm.extend({ init: function(){ this._super("Geometric Nucleus", "geometricnucleus", "4d3", "1d3", 6, "energy", false, 20); } });

// Rock
var rock = Firearm.extend({ init: function(){ this._super("Rock", "rock", "1d5", "1d4", 4, "earth", false, 21); } });

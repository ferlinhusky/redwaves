var Weapons = [];
var Weapon = Item.extend({
	init: function(name, type, supclass, dmg, material, twohand, refID){
		this._super(name, type, "weapon", supclass, material, refID); // push up to Item
		this.dmg = dmg;
		this.twohand = twohand;
	}
});

// Sword subclass
var Sword = Weapon.extend({
	init: function(name, type, dmg, material, twohand, refID){
		this._super(name, type, "sword", dmg, material, twohand, refID);
	}
});

// Dagger
var dagger = Sword.extend({ init: function(){ this._super("Dagger", "dagger", "1d3", "steel", false, 21); } });

// Long sword
var longsword = Sword.extend({ init: function(){ this._super("Long sword", "longsword", "1d6", "steel", false, 22); } });

// Short sword
var shortsword = Sword.extend({ init: function(){ this._super("Short sword", "shortsword", "1d4", "steel", false, 23); } });

// Broad sword
var broadsword = Sword.extend({ init: function(){ this._super("Broad sword", "broadsword", "1d10", "steel", true, 24); } });

// Staff subclass
var Staff = Weapon.extend({
	init: function(name, type, dmg, material, refID){
		this._super(name, type, "staff", dmg, material, true, refID);
	}
});

// Wooden Staff
var woodenstaff = Staff.extend({ init: function(){ this._super("Wooden staff", "woodenstaff", "1d2", "wood", 25); } });


// Appendage subclass
var Appendage = Weapon.extend({
	init: function(name, type, dmg, material, refID){
		this._super(name, type, "appendage", dmg, material, false, refID);
	}
});

// Fangs
var fangs = Appendage.extend({ init: function(){ this._super("Fangs", "fangs", "1d4", "bone", 26); } });

// Hand
var hand = Appendage.extend({ init: function(){ this._super("Hand", "hand", "1d1", "flesh", 27); } });

// Claw
var claw = Appendage.extend({ init: function(){ this._super("Claw", "claw", "1d4", "flesh", 28); } });

// Talons
var talons = Appendage.extend({ init: function(){ this._super("Talons", "talons", "2d4", "bone", 29); } });

// Firearm subclass
var Firearm = Weapon.extend({
	init: function(name, type, dmg, dmg_cl, rng, material, twohand, refID){
		this._super(name, type, "firearm", dmg, material, twohand, refID);
		this.rng = rng;
		this.dmg_cl = dmg_cl; // Close range damage
	}
});

// Crossbow
var crossbow = Firearm.extend({ init: function(){ this._super("Crossbow", "crossbow", 3, 3, 3, "wood", true, 30); } });

// English Longbow
var englishlongbow = Firearm.extend({ init: function(){ this._super("English longbow", "englishlongbow", 3, 1, 5, "steel", true, 31); } });

// Shotgun
var shotgun = Firearm.extend({ init: function(){ this._super("Shotgun", "shotgun", 6, 3, 4, "steel", true, 32); } });

// Six shooter
var sixshooter = Firearm.extend({ init: function(){ this._super("Six shooter", "sixshooter", 4, 1, 6, "steel", true, 33); } });
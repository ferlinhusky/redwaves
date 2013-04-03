var Weapons = [];
var Weapon = Item.extend({
	init: function(name, type, supclass, dmg, material, twohand){
		this._super(name, type, "weapon", supclass, material); // push up to Item
		this.dmg = dmg;
		this.twohand = twohand;
	}
});

// Sword subclass
var Sword = Weapon.extend({
	init: function(name, type, dmg, material, twohand){
		this._super(name, type, "sword", dmg, material, twohand);
	}
});

// Long sword
var longsword = Sword.extend({ init: function(){ this._super("Long Sword", "longsword", "1d6", "steel", false); } });

// Short sword
var shortsword = Sword.extend({ init: function(){ this._super("Short Sword", "shortsword", "1d4", "steel", false); } });

// Broad sword
var broadsword = Sword.extend({ init: function(){ this._super("Broad Sword", "broadsword", "1d10", "steel", true); } });

// Staff subclass
var Staff = Weapon.extend({
	init: function(name, type, dmg, material){
		this._super(name, type, "staff", dmg, material, true);
	}
});

// Wooden Staff
var woodenstaff = Staff.extend({ init: function(){ this._super("Wooden Staff", "woodenstaff", "1d2", "wood"); } });


// Appendage subclass
var Appendage = Weapon.extend({
	init: function(name, type, dmg, material){
		this._super(name, type, "appendage", dmg, material, false);
	}
});

// Fangs
var fangs = Appendage.extend({ init: function(){ this._super("Fangs", "fangs", "1d4", "bone"); } });

// Hand
var hand = Appendage.extend({ init: function(){ this._super("Hand", "hand", "1d1", "flesh"); } });

// Claw
var claw = Appendage.extend({ init: function(){ this._super("Claw", "claw", "1d4", "flesh"); } });

// Talons
var talons = Appendage.extend({ init: function(){ this._super("Talons", "talons", "2d4", "bone"); } });

// Firearm subclass
var Firearm = Weapon.extend({
	init: function(name, type, dmg, material, twohand){
		this._super(name, type, "firearm", dmg, material, twohand);
	}
});

// Shotgun
var shotgun = Firearm.extend({ init: function(){ this._super("Shotgun", "shotgun", "2r6", "steel", true); } });

// Six shooter
var sixshooter = Firearm.extend({ init: function(){ this._super("Six shooter", "sixshooter", "2r4", "steel", true); } });
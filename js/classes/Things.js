var Items = [];
var Item = Class.extend({
    init: function(name, type, ofType, supclass, dmg, material, twohand){
   	 this.name = name;
   	 this.type = type;
	 this.ofType = ofType;
   	 this.supclass = supclass;
   	 this.dmg = dmg;
   	 this.material = material;
   	 this.twohand = twohand;
   	 
   	 //Items.push(this); // Need to track all items?
    }
});

// Sword subclass
var Sword = Item.extend({
	init: function(name, type, dmg, material, twohand){
		this._super(name, type, "weapon", "sword", dmg, material, twohand);
	}
});

// Long sword
var longsword = Sword.extend({ init: function(){ this._super("Long Sword", "longsword", "1d6", "steel", false); } });

// Short sword
var shortsword = Sword.extend({ init: function(){ this._super("Short Sword", "shortsword", "1d4", "steel", false); } });

// Broad sword
var broadsword = Sword.extend({ init: function(){ this._super("Broad Sword", "broadsword", "1d10", "steel", true); } });

// Staff subclass
var Staff = Item.extend({
	init: function(name, type, dmg, material){
		this._super(name, type, "weapon", "staff", dmg, material, true);
	}
});

// Wooden Staff
var woodenstaff = Staff.extend({ init: function(){ this._super("Wooden Staff", "woodenstaff", "1d2", "wood"); } });


// Appendage subclass
var Appendage = Item.extend({
	init: function(name, type, dmg, material){
		this._super(name, type, "weapon", "appendage", dmg, material, false);
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
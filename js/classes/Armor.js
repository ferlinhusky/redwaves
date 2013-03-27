var Armors = [];
var Armor = Item.extend({
	init: function(name, type, supclass, material, ac){
		this._super(name, type, "armor", supclass, material); // push up to Item
		this.ac = ac;
	}
});

// Sword subclass
var Helmet = Armor.extend({
	init: function(name, type, material, ac){
		this._super(name, type, "helmet", material, ac);
	}
});

// Leather helm
var leatherhelm = Helmet.extend({ init: function(){ this._super("Leather helm", "leatherhelm", "leather", -1); } });

// Kettle hat w/ chain coif
var coifandkettle = Helmet.extend({ init: function(){ this._super("Coif and Kettle", "coifandkettle", "steel", -2); } });

// Barbute
var barbute = Helmet.extend({ init: function(){ this._super("Barbute", "barbute", "steel", -3); } });

// Close helmet
var closehelmet = Helmet.extend({ init: function(){ this._super("Close Helmet", "closehelmet", "steel", -5); } });
var Armors = [];
var Armor = Item.extend({
	init: function(name, type, supclass, material, ac){
		this._super(name, type, "armor", supclass, material); // push up to Item
		this.ac = ac;
	}
});

// Helmet subclass
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
var closehelmet = Helmet.extend({ init: function(){ this._super("Close helmet", "closehelmet", "steel", -4); } });

// Cowboy hat
var cowboyhat = Helmet.extend({ init: function(){ this._super("Cowboy hat", "cowboyhat", "felt", -1); } });

// Body armor subclass
var BodyArmor = Armor.extend({
	init: function(name, type, material, ac){
		this._super(name, type, "bodyarmor", material, ac);
	}
});

// Hide
var hide = BodyArmor.extend({ init: function(){ this._super("Hide", "hide", "hide", -2); } });

// Leather tunic
var leathertunic = BodyArmor.extend({ init: function(){ this._super("Leather tunic", "leathertunic", "hide", -2); } });

// Scale
var robe = BodyArmor.extend({ init: function(){ this._super("Robe", "robe", "cloth", -1); } });

// Scale
var scale = BodyArmor.extend({ init: function(){ this._super("Scale", "scale", "leather", -2); } });

// Chain-mail
var chainmail = BodyArmor.extend({ init: function(){ this._super("Chain-mail", "chainmail", "iron", -4); } });

// Brigandine
var brigandine = BodyArmor.extend({ init: function(){ this._super("Brigandine", "brigandine", "iron", -5); } });

// Plate
var plate = BodyArmor.extend({ init: function(){ this._super("Plate", "plate", "steel", -7); } });

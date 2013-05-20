var Armors = [];
var Armor = Item.extend({
	init: function(name, type, supclass, material, ac, refID){
		this._super(name, type, "armor", supclass, material, refID); // push up to Item
		this.ac = ac;
	}
});

// Helmet subclass
var Helmet = Armor.extend({
	init: function(name, type, material, ac, refID){
		this._super(name, type, "helmet", material, ac, refID);
	}
});

// Leather helm
var leatherhelm = Helmet.extend({ init: function(){ this._super("Leather helm", "leatherhelm", "leather", -1, 5); } });

// Kettle hat w/ chain coif
var coifandkettle = Helmet.extend({ init: function(){ this._super("Coif and Kettle", "coifandkettle", "steel", -2, 6); } });

// Barbute
var barbute = Helmet.extend({ init: function(){ this._super("Barbute", "barbute", "steel", -3, 7); } });

// Close helmet
var closehelmet = Helmet.extend({ init: function(){ this._super("Close helmet", "closehelmet", "steel", -4, 8); } });

// Cowboy hat
var cowboyhat = Helmet.extend({ init: function(){ this._super("Cowboy hat", "cowboyhat", "felt", -1, 9); } });

// Body armor subclass
var BodyArmor = Armor.extend({
	init: function(name, type, material, ac, refID){
		this._super(name, type, "bodyarmor", material, ac, refID);
	}
});

// Hide
var hide = BodyArmor.extend({ init: function(){ this._super("Hide", "hide", "hide", -2, 10); } });

// Leather tunic
var leathertunic = BodyArmor.extend({ init: function(){ this._super("Leather tunic", "leathertunic", "hide", -2, 11); } });

// Scale
var robe = BodyArmor.extend({ init: function(){ this._super("Robe", "robe", "cloth", -1, 12); } });

// Scale
var scale = BodyArmor.extend({ init: function(){ this._super("Scale", "scale", "leather", -2, 13); } });

// Chain-mail
var chainmail = BodyArmor.extend({ init: function(){ this._super("Chain-mail", "chainmail", "iron", -4, 14); } });

// Brigandine
var brigandine = BodyArmor.extend({ init: function(){ this._super("Brigandine", "brigandine", "iron", -5, 15); } });

// Plate
var plate = BodyArmor.extend({ init: function(){ this._super("Plate", "plate", "steel", -7, 16); } });

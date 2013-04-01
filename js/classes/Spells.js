var Spell = Item.extend({
	init: function(name, type, supclass, dmg, material, rng){
		this._super(name, type, "spell", supclass, material); // push up to Item
		this.dmg = dmg;
		this.rng = rng;
	}
});

// Attack subclass
var Attack = Spell.extend({
	init: function(name, type, dmg, material, rng){
		this._super(name, type, "attack", dmg, material, rng);
	}
});

// Fireball
var fireball = Attack.extend({ init: function(){ this._super("Fireball", "fireball", 10, "fire", 3); } });

// Freeze
var freeze = Attack.extend({ init: function(){ this._super("Freeze", "freeze", 6, "ice", 5); } });

// Lighting
var lightning = Attack.extend({ init: function(){ this._super("Lightning", "lightning", 4, "energy", 7); } });
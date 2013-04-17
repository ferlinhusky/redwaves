var Spell = Item.extend({
	init: function(name, type, supclass, dmg, material, rng, callback){
		this._super(name, type, "spell", supclass, material); // push up to Item
		this.dmg = dmg;
		this.rng = rng;
                if(callback != undefined){
                    this.callback = callback;
                }
	},
        cast: function(sobj){
            var ap = World.activePlayer;
            if(ap.currMove < ap.movement){
                this.callback(sobj, ap);
            } else if (me.currMove == me.movement){
                btnSpell.removeClass('blink')
                        .button('disable');
                btnSelectSpell.button('disable');
            }
        }
});

// Attack subclass
var Attack = Spell.extend({
    init: function(name, type, dmg, material, rng){
            this._super(name, type, "attack", dmg, material, rng, function(sobj, ap){
            if(sobj.occupiedBy.ofType == "monster"){
                var battle = new Battle(ap, sobj.occupiedBy);
                ap.move();
            }
        });
    }
});

// Fireball
var fireball = Attack.extend({ init: function(){ this._super("Fireball", "fireball", 10, "fire", 3); } });

// Freeze
var freeze = Attack.extend({ init: function(){ this._super("Freeze", "freeze", 6, "ice", 5); } });

// Lighting
var lightning = Attack.extend({ init: function(){ this._super("Lightning", "lightning", 4, "energy", 7); } });

// Earthquake
var earthquake = Spell.extend({
    init: function(){
        this._super("Earthquake", "earthquake", "physical", 4, "earth", 6, function(){
            alert(this.name);
        });
    }
});
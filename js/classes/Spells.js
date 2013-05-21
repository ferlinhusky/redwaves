var Spell = Item.extend({
	init: function(name, type, supclass, dmg, material, rng, callback, refID){
		this._super(name, type, "spell", supclass, material, refID); // push up to Item
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
            } else if (ap.currMove == ap.movement){
                btnSpell.removeClass('blink')
                        .button('disable');
                btnSelectSpell.button('disable');
            }
        }
});

// Attack subclass
var Attack = Spell.extend({
    init: function(name, type, dmg, material, rng, refID){
            this._super(name, type, "attack", dmg, material, rng, function(sobj, ap){
            if(sobj.occupiedBy.ofType == "monster"){
                var battle = new Battle(ap, sobj.occupiedBy);
                ap.move();
            }
        }, refID);
    }
});

// Fireball
var fireball = Attack.extend({ init: function(){ this._super("Fireball", "fireball", 10, "fire", 3, 1); } });

// Freeze
var freeze = Attack.extend({ init: function(){ this._super("Freeze", "freeze", 6, "ice", 5, 2); } });

// Lighting
var lightning = Attack.extend({ init: function(){ this._super("Lightning", "lightning", 4, "energy", 7, 3); } });

// Earthquake
var earthquake = Spell.extend({
    init: function(){
        this._super("Earthquake", "earthquake", "physical", 0, "earth", 6, function(sobj, ap){
		$('#map_container').effect('shake', 'fast');
            $('.range.earth').each(function(){
				// Create random pits
				var chance = Math.ceil(Math.random()*10);
				if(chance == 1 && !$(this).hasClass('pit') && !$(this).hasClass('start')){
					$(this).addClass('pit');
					var psobj = Squares[$(this).attr('data-sid')];
					psobj.t = Pit;
					psobj.passable = psobj.t.passable;
					psobj.cthru = psobj.t.cthru;
					// Check if character falls in and is hurt/killed
					if (psobj.occupied) {
						var dmg = Math.ceil(Math.random()*5);
						var status_line;
						HP_set(psobj.occupiedBy, -dmg);
						if(psobj.occupiedBy.HP <= 0){
							status_line = '<span class="red">' + psobj.occupiedBy.name + ' falls in a pit and dies!</span>';	
							psobj.occupiedBy.killed();
						} else {
							status_line = '<span class="red">' + psobj.occupiedBy.name + ' falls in a pit!</span>';	
						}
						Statuss.update(status_line);
					}
				}
			});
			Input.handleSpell();
			ap.move();
        }, 4);
    }
});
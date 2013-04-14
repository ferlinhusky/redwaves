var Items = [];
var Item = Class.extend({
	init: function(name, type, ofType, supclass, material){
		this.name = name;
		this.type = type;
		this.ofType = ofType;
		this.supclass = supclass;
		this.material = material;
		Items.push(this);
	}
});

// Medicine
var Medicine = Item.extend({
	init: function(name, type, supclass, material){
		this._super(name, type, "medicine", supclass, material); // push up to Item
	},
	use: function(){
		Statuss.update('<b>' + World.activePlayer.name + ' uses ' + this.name + '!</b>');
		// Unbuild the item menu
		unbuildItemMenu();
		// Remove item from inventory
		
		for(var i=0; i<World.activePlayer.inven.length; i++){
			if(World.activePlayer.inven[i].name == this.name){
				World.activePlayer.inven.splice(i, 1);
				break; // end loop
			}
		}
		
		// (Re)build the item menu
		buildItemMenu();
	}
});

	// Painkiller subclass
	var Painkiller = Medicine.extend({
		init: function(name, type, material, heals){
			this._super(name, type, "painkiller", material);
			this.heals = heals;
		},
		use: function(){
			this._super();
			HP_set(World.activePlayer, Math.ceil(Math.random() * this.heals)+1);
		}
	});
	
		// Phyton
		var phyton = Painkiller.extend({ init: function(){ this._super("Phyton", "phyton", "herb", 3); } });
		
		// Glory
		var glory = Painkiller.extend({ init: function(){ this._super("Glory", "glory", "herb", 11); } });
		
	// Stimulant subclass
	var Stimulant = Medicine.extend({
		init: function(name, type, material){
			this._super(name, type, "stimulant", material);
		},
		use: function(){
			this._super();
			World.activePlayer.medication.push(this);
		}
	});
	
		// Mad Dog
		var maddog = Stimulant.extend({ init: function(){ this._super("Mad dog", "maddog", "pill"); } });
		
		// Tron
		var tron = Stimulant.extend({ init: function(){ this._super("Tron", "tron", "pill"); } });
		
		
var Items = [];
var Item = Class.extend({
	init: function(name, type, ofType, supclass, material, refID){
		this.is = "item";
		this.name = name;
		this.type = type;
		this.ofType = ofType;
		this.supclass = supclass;
		this.material = material;
		this.ID = Items.length;
		this.refID = refID;
		Items.push(this);
	},
	pickup: function(curr){
		//getMapSq(World.activePlayer.coords).effect("transfer", { to: $('#btn_item') }, 1000);
		
		// Remove item from current square
		Squares[curr].contains = false;
		Squares[curr].containsA = "";
		
		current = Squares[curr].onMap;
		findAndRemove(current, '.p', 'item ' + this.type);
		
		// Add to inventory
		Statuss.update('<b>' + World.activePlayer.name + ' picks up ' + this.name + '!</b>');
		// Unbuild the item menu
		unbuildItemMenu();
		// Push to inventory
		World.activePlayer.inven.push(this);
		// (Re)build the item menu
		buildItemMenu();
	},
	drop: function(curr){
		Squares[curr].contains = true;
		Squares[curr].containsA = this;
		
		// Set item position
		var current = Squares[curr].onMap;
		var loc = [Squares[curr].x, Squares[curr].y];
		this.coords = loc;
		this.currentSquare = getSquare(this.coords).id;
		
		// Add item to current square
		findAndAdd(current, '.p', 'item ' + this.type + ' ' + this.ID);
	}
});

// Medicine
var Medicine = Item.extend({
	init: function(name, type, supclass, material, refID){
		this._super(name, type, "medicine", supclass, material, refID); // push up to Item
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
		init: function(name, type, material, heals, refID){
			this._super(name, type, "painkiller", material, refID);
			this.heals = heals;
		},
		use: function(){
			this._super();
			HP_set(World.activePlayer, Math.ceil(Math.random() * this.heals)+1);
		}
	});
	
		// Phyton
		var phyton = Painkiller.extend({ init: function(){ this._super("Phyton", "phyton", "herb", 3, 1); } });
		
		// Glory
		var glory = Painkiller.extend({ init: function(){ this._super("Glory", "glory", "herb", 11, 2); } });
		
	// Stimulant subclass
	var Stimulant = Medicine.extend({
		init: function(name, type, material, refID){
			this._super(name, type, "stimulant", material, refID);
		},
		use: function(){
			this._super();
			World.activePlayer.medication.push(this);
		}
	});
	
		// Mad Dog
		var maddog = Stimulant.extend({ init: function(){ this._super("Mad dog", "maddog", "pill", 3); } });
		
		// Tron
		var tron = Stimulant.extend({ init: function(){ this._super("Tron", "tron", "pill", 4); } });
		
		
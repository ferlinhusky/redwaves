var Item = Class.extend({
	init: function(name, type, ofType, supclass, material, refID){
		this.is = "item";
		this.name = name;
		this.type = type;
		this.ofType = ofType;
		this.supclass = supclass;
		this.material = material;
		this.refID = refID;
	},
	pickup: function(curr, itemid){	
		var action = "picks up";
		var p = World.activePlayer;
			
		// Unbuild menus
		if (p.ofType == "player") { unbuildAllMenus(); }
		
		// Push to inventory, if possible
		var isplaced = false;
		switch (this.ofType) {
			case "weapon"	:
				for (var i=0; i<p.wields.length; i++) {
					if (p.wields[i] == "" || p.wields[i].type == "hands") {
						p.wields[i] = this;
						isplaced = true;
						break;
					}
				}
				break;
			case "armor"	: 
				var drop_armor;
				switch(this.supclass) {
					case "helmet":
						drop_armor = 0;
						break;
					case "bodyarmor":
						drop_armor = 1;
						break;
					case "shield":	
						drop_armor = 2;
						break;
					default:	break;
				}
				isplaced = true;
				action = "puts on the";
				// If wearing armor here, drop it
				if(p.wears[drop_armor] != ""){
					p.wears[drop_armor].drop(p, curr);
				}
				p.wears[drop_armor] = this;
				p.updateArmor();
				break;
			default 		: p.inven.push(this); isplaced = true; break;
		}

		// (Re)build menus
		if (p.ofType == "player") { buildAllMenus(); }
		
		// If item is placed
		if (isplaced == true) {
			var current = Squares[curr].onMap;
			
			// Remove item from current square, Obj and UI
			Squares[curr].containsA.splice(itemid, 1);
			findAndRemove(current, '.p', 'item ' + this.ofType);
			
			// Reset square css in case duplicate item types
			for (var i=0; i<Squares[curr].containsA.length; i++) {
				findAndAdd(current, '.p', 'item ' + Squares[curr].containsA[i].ofType);
			}
			
			// Update status
			Statuss.update('<b>' + World.activePlayer.name + ' ' + action + ' ' + this.name + '!</b>');
			
			// Check if all picked up from square
			if (Squares[curr].containsA.length == 0) {
				Squares[curr].contains = false;
				if (p.ofType == "player") { btnPickup.button('disable'); }
			}
			
			if (p.ofType == "player") { 
				// Reset pickup menu, enable pickup
				Input.selectPickup();
				btnDrop.button('enable');
			}
		} else {
			if (p.ofType == "player") { 
				Input.M_Dialog(
					"standard",
					"<p>You can't carry any more "+this.ofType+"s.</p>",
					"All full up",
					false,
					200,
					300);
			}
		}
	},
	drop: function(p, curr){
		// Unbuild menus
		if (p.ofType == "player") { unbuildAllMenus(); }
		
		// Update square
		Squares[curr].contains = true;
		Squares[curr].containsA.push(this);
		
		// Set item position
		var current = Squares[curr].onMap;
		var loc = [Squares[curr].x, Squares[curr].y];
		this.coords = loc;
		this.currentSquare = getSquare(this.coords).id;
		
		// Add item to current square
		findAndAdd(current, '.p', 'item ' + this.ofType);
		
		// Remove from player inventory
		switch(this.ofType){
			case "weapon"	:
				// Remove dropped weapon from wields[]
				for (var i=0; i<p.wields.length; i++) {
					if (p.wields[i] == this) {
						p.wields[i] = "";
						break;
					}
				}
				// If readyWeapon was dropped and there are any other weapons in wields[], set next as readyWeapon
				if(this == p.readyWeapon){
					for (var i=0; i<p.wields.length; i++) {
						if (p.wields[i] != "") {
							p.readyWeapon = p.wields[i];
						}
					}
				}
				// If there are no weapons whatsoever, wield hands
				if (p.wields.join('')=="") {
					p.wields[0] = new hands;
					p.readyWeapon = p.wields[0];
					p.updateWpn();
				}
				break;
			case "armor"	:
				var drop_armor;
				switch(this.supclass) {
					case "helmet":
						drop_armor = 0;
						break;
					case "bodyarmor":
						drop_armor = 1;
						break;
					case "shield":	
						drop_armor = 2;
						break;
					default:	break;
				}
				p.wears[drop_armor] = "";
				p.updateArmor();
				break;
			default	:
				for (var i=0; i<p.inven.length; i++) {
					if (p.inven[i] == this) {
						p.inven.splice(i, 1);
						break;
					}
				}
				break;
		}
		
		// Update status // Check why drop is firing automatically
		Statuss.update('<b>' + p.name + ' drops ' + this.name + '!</b>');
		
		if (p.ofType == "player") {
			// Reset drop menu, enable pickup
			Input.dropList = [];
			if (Input.dropMenu == true) {
				Input.selectDrop();	
			}
			btnPickup.button('enable');
			
			// Check here if anything left to drop; enable disable button...and re-enable on pickup
			checkDropBtn();
			
			// Rebuild all menus
			buildAllMenus();
		}
	}
});

// Medicine
var Medicine = Item.extend({
	init: function(name, type, supclass, material, price, refID){
		this._super(name, type, "medicine", supclass, material, refID); // push up to Item
		this.price = price;
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
		init: function(name, type, material, heals, price, refID){
			this._super(name, type, "painkiller", material, price, refID);
			this.heals = heals;
		},
		use: function(){
			this._super();
			HP_set(World.activePlayer, Math.ceil(Math.random() * this.heals)+1);
		}
	});
	
		// Phyton
		var phyton = Painkiller.extend({ init: function(){ this._super("Phyton", "phyton", "herb", 3, 100, 1); } });
		
		// Glory
		var glory = Painkiller.extend({ init: function(){ this._super("Glory", "glory", "herb", 11, 350, 2); } });
		
	// Stimulant subclass
	var Stimulant = Medicine.extend({
		init: function(name, type, material, price, refID){
			this._super(name, type, "stimulant", material, price, refID);
		},
		use: function(){
			this._super();
			World.activePlayer.medication.push(this);
		}
	});
	
		// Mad Dog
		var maddog = Stimulant.extend({ init: function(){ this._super("Mad dog", "maddog", "pill", 200, 3); } });
		
		// Tron
		var tron = Stimulant.extend({ init: function(){ this._super("Tron", "tron", "pill", 400, 4); } });
		
		
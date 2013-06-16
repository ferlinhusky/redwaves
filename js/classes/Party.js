var Party = Class.extend({
	init: function(){
	    this.gold = 0;
	    this.levelcomplete = 0;
	    this.store = [0,0,0,0,0,0];
	    this.members = [];
	    this.passcode = "";
	}
});

var Equip = Class.extend({
	init: function(){
		// Create UI - player types/items, shared items, buyable items
		
		// Init draggable items
		$('.ui-dialog .equip .items li').draggable();
		
		// Init droppoable areas
		
		// Do drop tests
	},
	save: function(){
		// Save items to player, shared, etc.
	}
});
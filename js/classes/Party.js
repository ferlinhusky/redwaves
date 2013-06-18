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
		// Create UI vars
		this.ui = $('.ui-dialog .equip');
		var ui = this.ui;
		
		// Create UI - player types/items, shared items, buyable items
		var tabs = "";
		for(var i=0; i<Party.members.length; i++){
			var p = Party.members[i];
			tabs += '<li data-type="'+p.type+'" class="player '+ p.type +'">'+p.name+'</li>';
			ui.find('.itemgroupstmp').clone()
				.removeClass('itemgroupstmp')
				.addClass('itemgroups '+ p.type)
				.appendTo(ui);
		}
		
		ui.find('.players').html(tabs);
		ui.find('.players .player').click(function(){
			ui.find('.itemgroups').css('display', 'none');
			ui.find('.itemgroups.' + $(this).attr('data-type')).css('display', 'block');
		});
		ui.find('.itemgroups.hero').css('display', 'block');
		ui.append('<div class="group shared"><span class="title">Shared</span>\
			<ul class="items">\
			    <li><i>Empty</i></li>\
			    <li><i>Empty</i></li>\
			    <li><i>Empty</i></li>\
			    <li><i>Empty</i></li>\
			    <li><i>Empty</i></li>\
			    <li><i>Empty</i></li>\
			</ul>');
		
		// Populate UI w/ Player data
		
		// Init draggable items
		ui.find('.items li').draggable({
			revert: 'invalid'
		});
		
		// Init droppoable areas
		
		// Do drop tests
	},
	save: function(){
		// Save items to player, shared, etc.
	}
});
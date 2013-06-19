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
			
			// Populate UI w/ Player data
			$('.itemgroups.' + p.type).find('.items li').each(function(k, v){
				$(this).attr('data-type', 'pack');
				$(this).attr('data-default', $(this).text());
				if (p.inven[k] != undefined) {
					$(this).text(p.inven[k].name);
					$(this).addClass('filled');
				}
			});
			
			$('.itemgroups.' + p.type).find('.weapons li').each(function(k, v){
				$(this).attr('data-type', 'weapons');
				$(this).attr('data-default', $(this).text());
				if (p.wields[k] != "") {
					$(this).text(p.wields[k].name);
					$(this).addClass('filled');
				}
			});
			
			$('.itemgroups.' + p.type).find('.armor li').each(function(k, v){
				$(this).attr('data-type', 'armor');
				$(this).attr('data-default', $(this).text());
				if (p.wears[k] != "") {
					$(this).text(p.wears[k].name);
					$(this).addClass('filled');
				} else { $(this).addClass('empty'); }
			});
		}
		
		ui.find('.players').html(tabs);
		ui.find('.players .player').click(function(){
			ui.find('.itemgroups').css('display', 'none');
			ui.find('.itemgroups.' + $(this).attr('data-type')).css('display', 'table');
		});
		ui.find('.itemgroups.hero').css('display', 'table');
		
		ui.append('<div class="group shared"><span class="title">Shared</span>\
			<ul class="items">\
			    <li class="empty"><i>Empty</i></li>\
			    <li class="empty"><i>Empty</i></li>\
			    <li class="empty"><i>Empty</i></li>\
			    <li class="empty"><i>Empty</i></li>\
			    <li class="empty"><i>Empty</i></li>\
			    <li class="empty"><i>Empty</i></li>\
			</ul>');
		
		// Init draggable items
		ui.find('.items li.filled').draggable({
			revert: 'invalid'
		});
		
		// Init droppoable areas
		ui.find('.shared .items li.empty').droppable({
			drop: function(e, u) {
				var dropped = $(u.draggable);
				
				$(this).addClass('filled')
					.removeClass('empty')
					.addClass(dropped.attr('data-type'))
					.text(dropped.text())
					.droppable('destroy')
					.draggable({
						revert: 'invalid'
					});
				
				// Reset list item
				dropped.clone()
					.insertBefore(dropped)
					.removeClass()
					.addClass('empty')
					.attr('style', '')
					.text(dropped.attr('data-default'));
				dropped.remove();
				
				// update droppable after each drop
			},
			accept: '.itemgroups li.filled' 
		});
		
		// Do drop tests
	},
	save: function(){
		// Save items to player, shared, etc.
	}
});